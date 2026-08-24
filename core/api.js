/* ==========================================================================
   ASTREA™ Admin
   API
   ========================================================================== */


/* ==========================================================================
   GET resilience / cache
   ========================================================================== */

/*
 * Cache corto para navegación rápida entre módulos.
 *
 * Objetivo:
 * reducir llamadas repetidas a Apps Script sin convertir
 * el frontend en una fuente persistente de datos.
 */
const ADMIN_API_GET_CACHE_TTL = 10000;


/*
 * action -> {
 *   data,
 *   timestamp
 * }
 */
const ADMIN_API_GET_CACHE =
  new Map();


/*
 * action -> Promise
 *
 * Permite que múltiples GET idénticos simultáneos
 * reutilicen una misma solicitud real.
 */
const ADMIN_API_PENDING_GETS =
  new Map();


/* ==========================================================================
   Public request wrapper
   ========================================================================== */

async function adminApiRequest(
  action,
  options = {}
) {
  const method =
    String(
      options.method || "GET"
    ).toUpperCase();

  /*
   * Las escrituras nunca utilizan cache
   * ni deduplicación.
   */
  if (method !== "GET") {
    return executeAdminApiRequest(
      action,
      options
    );
  }

  /*
   * 1. Intentar responder desde cache reciente.
   */
  const cached =
    getAdminApiCachedResponse(
      action
    );

  if (cached !== null) {
    return cached;
  }

  /*
   * 2. Si el mismo GET ya está en curso,
   * reutilizar su Promise.
   */
  if (
    ADMIN_API_PENDING_GETS.has(
      action
    )
  ) {
    return ADMIN_API_PENDING_GETS.get(
      action
    );
  }

  /*
   * 3. Crear la solicitud real.
   */
  const request =
    executeAdminApiRequest(
      action,
      options
    )
      .then(data => {
        setAdminApiCachedResponse(
          action,
          data
        );

        return data;
      })
      .finally(() => {
        ADMIN_API_PENDING_GETS.delete(
          action
        );
      });

  ADMIN_API_PENDING_GETS.set(
    action,
    request
  );

  return request;
}


/* ==========================================================================
   Base HTTP request
   ========================================================================== */

async function executeAdminApiRequest(
  action,
  options = {}
) {
  const method =
    String(
      options.method || "GET"
    ).toUpperCase();

  const body =
    options.body || null;

  /*
   * Sólo los GET se reintentan automáticamente.
   *
   * Un POST podría haber sido procesado correctamente
   * aunque la respuesta se pierda, por lo que repetirlo
   * podría generar efectos duplicados.
   */
  const retries =
    options.retries !== undefined
      ? options.retries
      : method === "GET"
        ? 2
        : 0;

  const timeout =
    options.timeout || 12000;

  const url =
    `${ADMIN_CONFIG.api.endpoint}?action=${encodeURIComponent(action)}`;

  let lastError = null;

  for (
    let attempt = 0;
    attempt <= retries;
    attempt++
  ) {
    const controller =
      new AbortController();

    const timeoutId =
      setTimeout(
        () => controller.abort(),
        timeout
      );

    try {
      const fetchOptions = {
        method,
        signal: controller.signal
      };

      if (body !== null) {
        fetchOptions.headers = {
          "Content-Type":
            "text/plain;charset=utf-8"
        };

        fetchOptions.body =
          JSON.stringify(body);
      }

      const response =
        await fetch(
          url,
          fetchOptions
        );

      /*
       * Leemos primero como texto.
       *
       * Apps Script / Google puede devolver HTML ante
       * errores temporales de infraestructura.
       */
      const responseText =
        await response.text();

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      /*
       * Evitar intentar JSON.parse() sobre páginas
       * HTML de Google.
       */
      if (
        !contentType.includes(
          "application/json"
        ) &&
        !looksLikeJson(
          responseText
        )
      ) {
        throw createAdminApiError(
          "El servicio respondió con un formato inesperado.",
          {
            retryable: true,
            status: response.status
          }
        );
      }

      let data;

      try {
        data =
          JSON.parse(
            responseText
          );
      } catch (error) {
        throw createAdminApiError(
          "La respuesta del servicio no contiene JSON válido.",
          {
            retryable: true,
            status: response.status
          }
        );
      }

      /*
       * Error HTTP.
       */
      if (!response.ok) {
        throw createAdminApiError(
          data.message ||
            `Error HTTP ${response.status}.`,
          {
            retryable:
              isRetryableAdminStatus(
                response.status
              ),

            status:
              response.status
          }
        );
      }

      /*
       * Error funcional válido de ASTREA.
       *
       * Ejemplo:
       * {
       *   success: false,
       *   message: "El nombre es obligatorio."
       * }
       *
       * No debe reintentarse.
       */
      if (
        data.success === false
      ) {
        throw createAdminApiError(
          data.message ||
            "La operación no pudo completarse.",
          {
            retryable: false,
            status:
              response.status
          }
        );
      }

      return data;

    } catch (error) {
      if (
        error &&
        error.name ===
          "AbortError"
      ) {
        lastError =
          createAdminApiError(
            "El servicio tardó demasiado en responder.",
            {
              retryable: true
            }
          );
      } else {
        lastError = error;
      }

      const canRetry =
        method === "GET" &&
        lastError &&
        lastError.retryable === true &&
        attempt < retries;

      if (!canRetry) {
        break;
      }

      await adminApiDelay(
        getAdminRetryDelay(
          attempt
        )
      );

    } finally {
      clearTimeout(
        timeoutId
      );
    }
  }

  console.error(
    `[ASTREA API] ${action}`,
    lastError
  );

  throw new Error(
    getAdminApiUserMessage(
      lastError
    )
  );
}


/* ==========================================================================
   GET cache
   ========================================================================== */

function getAdminApiCachedResponse(
  action
) {
  const entry =
    ADMIN_API_GET_CACHE.get(
      action
    );

  if (!entry) {
    return null;
  }

  const age =
    Date.now() -
    entry.timestamp;

  if (
    age >=
    ADMIN_API_GET_CACHE_TTL
  ) {
    ADMIN_API_GET_CACHE.delete(
      action
    );

    return null;
  }

  return entry.data;
}


function setAdminApiCachedResponse(
  action,
  data
) {
  ADMIN_API_GET_CACHE.set(
    action,
    {
      data,
      timestamp:
        Date.now()
    }
  );
}


/*
 * Puede invalidar una acción específica
 * o todo el cache.
 */
function clearAdminApiCache(
  action = null
) {
  if (action) {
    ADMIN_API_GET_CACHE.delete(
      action
    );

    return;
  }

  ADMIN_API_GET_CACHE.clear();
}


/* ==========================================================================
   API resilience helpers
   ========================================================================== */

function looksLikeJson(
  value
) {
  const text =
    String(
      value || ""
    ).trim();

  return (
    text.startsWith("{") ||
    text.startsWith("[")
  );
}


function createAdminApiError(
  message,
  {
    retryable = false,
    status = null
  } = {}
) {
  const error =
    new Error(
      message
    );

  error.retryable =
    retryable;

  error.status =
    status;

  return error;
}


function isRetryableAdminStatus(
  status
) {
  return (
    status === 408 ||
    status === 425 ||
    status === 429 ||
    status >= 500
  );
}


function getAdminRetryDelay(
  attempt
) {
  const delays = [
    500,
    1200
  ];

  return (
    delays[attempt] ||
    delays[
      delays.length - 1
    ]
  );
}


function adminApiDelay(
  milliseconds
) {
  return new Promise(
    resolve => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}


function getAdminApiUserMessage(
  error
) {
  if (!error) {
    return (
      "No se pudo comunicar con el servicio."
    );
  }

  /*
   * Mantener los mensajes funcionales
   * enviados legítimamente por ASTREA.
   */
  if (
    error.retryable === false
  ) {
    return error.message;
  }

  return (
    "El servicio no respondió correctamente. " +
    "Intentá nuevamente en unos segundos."
  );
}


/* ==========================================================
   Products
   ========================================================== */

async function adminFetchProducts() {
  const data =
    await adminApiRequest(
      "adminProducts"
    );

  return (
    data.products || []
  );
}


async function adminCreateProduct(
  product
) {
  const result =
    await adminApiRequest(
      "createProduct",
      {
        method: "POST",
        body: product
      }
    );

  /*
   * Products cambió.
   * La próxima lectura debe venir del backend.
   */
  clearAdminApiCache(
    "adminProducts"
  );

  clearAdminApiCache(
    "products"
  );

  return result;
}


async function adminUpdateProduct(
  product
) {
  const result =
    await adminApiRequest(
      "updateProduct",
      {
        method: "POST",
        body: product
      }
    );

  clearAdminApiCache(
    "adminProducts"
  );

  clearAdminApiCache(
    "products"
  );

  return result;
}


async function adminToggleProduct(
  id
) {
  const result =
    await adminApiRequest(
      "toggleProduct",
      {
        method: "POST",
        body: {
          id
        }
      }
    );

  clearAdminApiCache(
    "adminProducts"
  );

  clearAdminApiCache(
    "products"
  );

  return result;
}


/* ==========================================================
   Orders
   ========================================================== */

async function adminFetchOrders() {
  const data =
    await adminApiRequest(
      "orders"
    );

  return (
    data.orders || []
  );
}


async function adminUpdateOrderStatus(
  orderId,
  status
) {
  const result =
    await adminApiRequest(
      "updateOrderStatus",
      {
        method: "POST",
        body: {
          orderId,
          status
        }
      }
    );

  /*
   * El listado de pedidos cambió.
   */
  clearAdminApiCache(
    "orders"
  );

  /*
   * Customers deriva última compra
   * desde Orders.
   *
   * Invalidarlo mantiene segura
   * la relación entre ambos dominios.
   */
  clearAdminApiCache(
    "customers"
  );

  return result;
}


/* ==========================================================
   Customers
   ========================================================== */

async function adminFetchCustomers() {
  const data =
    await adminApiRequest(
      "customers"
    );

  return (
    data.customers || []
  ).map(
    customer => ({
      id:
        customer.id,

      name:
        customer.nombre,

      phone:
        customer.telefono,

      category:
        customer.categoria,

      notes:
        customer.notas,

      active:
        customer.activo === true ||
        customer.activo ===
          "TRUE",

      orders:
        Number(
          customer.orders || 0
        ),

      lastPurchase:
        customer.ultimaCompra,

      createdAt:
        customer.createdAt,

      updatedAt:
        customer.updatedAt
    })
  );
}


async function adminUpdateCustomer(
  customer
) {
  const result =
    await adminApiRequest(
      "updateCustomer",
      {
        method: "POST",

        body: {
          id:
            customer.id,

          nombre:
            customer.name,

          telefono:
            customer.phone,

          notas:
            customer.notes ||
            ""
        }
      }
    );

  clearAdminApiCache(
    "customers"
  );

  return result;
}


/* ==========================================================
   Business
   ========================================================== */

async function adminFetchBusiness() {
  const data =
    await adminApiRequest(
      "business"
    );

  return (
    data.business || null
  );
}


async function adminUpdateBusiness(
  section,
  data
) {
  const result =
    await adminApiRequest(
      "updateBusiness",
      {
        method: "POST",

        body: {
          section,
          data
        }
      }
    );

  /*
   * Business cambió.
   * Evitamos reutilizar un GET anterior.
   */
  clearAdminApiCache(
    "business"
  );

  return result;
}
