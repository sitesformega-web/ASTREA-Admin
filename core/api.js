/* ==========================================================================
   API request cache
   ========================================================================== */

const ADMIN_API_GET_CACHE_TTL = 10000;

const ADMIN_API_GET_CACHE =
  new Map();

const ADMIN_API_PENDING_GETS =
  new Map();

async function adminApiRequest(
  action,
  options = {}
) {
  const {
    method = "GET",
    body = null,
    retries = 2,
    timeout = 12000,
    useCache = true
  } = options;

  const normalizedMethod =
    String(method).toUpperCase();

  /*
   * Sólo cacheamos GET.
   *
   * POST y cualquier futura operación de escritura
   * siempre llegan al backend.
   */
  if (
    normalizedMethod === "GET" &&
    useCache
  ) {
    const cached =
      getAdminApiCachedResponse(action);

    if (cached !== null) {
      return cached;
    }

    /*
     * Si ya existe exactamente este GET en curso,
     * reutilizamos su Promise.
     */
    if (
      ADMIN_API_PENDING_GETS.has(action)
    ) {
      return ADMIN_API_PENDING_GETS.get(
        action
      );
    }

    const request =
      executeAdminApiRequest(
        action,
        {
          method: normalizedMethod,
          body,
          retries,
          timeout
        }
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

  /*
   * Las escrituras nunca usan cache.
   */
  return executeAdminApiRequest(
    action,
    {
      method: normalizedMethod,
      body,
      retries,
      timeout
    }
  );
}

async function executeAdminApiRequest(
  action,
  {
    method = "GET",
    body = null,
    retries = 2,
    timeout = 12000
  } = {}
) {
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

      const responseText =
        await response.text();

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        !contentType.includes(
          "application/json"
        ) &&
        !looksLikeJson(responseText)
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
          JSON.parse(responseText);
      } catch (error) {
        throw createAdminApiError(
          "La respuesta del servicio no contiene JSON válido.",
          {
            retryable: true,
            status: response.status
          }
        );
      }

      if (!response.ok) {
        throw createAdminApiError(
          data.message ||
            `Error HTTP ${response.status}.`,
          {
            retryable:
              isRetryableAdminStatus(
                response.status
              ),

            status: response.status
          }
        );
      }

      if (data.success === false) {
        throw createAdminApiError(
          data.message ||
            "La operación no pudo completarse.",
          {
            retryable: false,
            status: response.status
          }
        );
      }

      return data;

    } catch (error) {
      if (
        error &&
        error.name === "AbortError"
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
        lastError &&
        lastError.retryable === true &&
        attempt < retries;

      if (!canRetry) {
        break;
      }

      await adminApiDelay(
        getAdminRetryDelay(attempt)
      );

    } finally {
      clearTimeout(timeoutId);
    }
  }

  console.error(
    `[ASTREA API] ${action}`,
    lastError
  );

  throw new Error(
    getAdminApiUserMessage(lastError)
  );
}

function getAdminApiCachedResponse(
  action
) {
  const entry =
    ADMIN_API_GET_CACHE.get(action);

  if (!entry) {
    return null;
  }

  const age =
    Date.now() - entry.timestamp;

  if (age >= ADMIN_API_GET_CACHE_TTL) {
    ADMIN_API_GET_CACHE.delete(action);

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
      timestamp: Date.now()
    }
  );
}


function clearAdminApiCache(action) {
  if (action) {
    ADMIN_API_GET_CACHE.delete(action);

    return;
  }

  ADMIN_API_GET_CACHE.clear();
}
      /*
       * Apps Script puede responder HTML ante
       * fallos temporales de infraestructura.
       *
       * No intentamos parsearlo como JSON.
       */
      if (
        !contentType.includes(
          "application/json"
        ) &&
        !looksLikeJson(responseText)
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
          JSON.parse(responseText);
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

            status: response.status
          }
        );
      }

      /*
       * Error funcional devuelto por ASTREA.
       *
       * Ejemplo:
       * {
       *   success: false,
       *   message: "El nombre es obligatorio."
       * }
       *
       * No debe reintentarse.
       */
      if (data.success === false) {
        throw createAdminApiError(
          data.message ||
            "La operación no pudo completarse.",
          {
            retryable: false,
            status: response.status
          }
        );
      }

      return data;

    } catch (error) {
      if (
        error &&
        error.name === "AbortError"
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
        lastError &&
        lastError.retryable === true &&
        attempt < retries;

      if (!canRetry) {
        break;
      }

      await adminApiDelay(
        getAdminRetryDelay(attempt)
      );

    } finally {
      clearTimeout(timeoutId);
    }
  }

  console.error(
    `[ASTREA API] ${action}`,
    lastError
  );

  throw new Error(
    getAdminApiUserMessage(lastError)
  );
}


/* ==========================================================================
   API resilience helpers
   ========================================================================== */

function looksLikeJson(value) {
  const text =
    String(value || "").trim();

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
    new Error(message);

  error.retryable = retryable;
  error.status = status;

  return error;
}


function isRetryableAdminStatus(status) {
  return (
    status === 408 ||
    status === 425 ||
    status === 429 ||
    status >= 500
  );
}


function getAdminRetryDelay(attempt) {
  const delays = [
    500,
    1200
  ];

  return (
    delays[attempt] ||
    delays[delays.length - 1]
  );
}


function adminApiDelay(milliseconds) {
  return new Promise(resolve => {
    setTimeout(
      resolve,
      milliseconds
    );
  });
}


function getAdminApiUserMessage(error) {
  if (!error) {
    return "No se pudo comunicar con el servicio.";
  }

  /*
   * Los errores funcionales del backend
   * conservan su mensaje original.
   */
  if (error.retryable === false) {
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
  const data = await adminApiRequest(
    "adminProducts"
  );

  return data.products || [];
}

async function adminCreateProduct(product) {
  return await adminApiRequest(
    "createProduct",
    {
      method: "POST",
      body: product
    }
  );
}

async function adminUpdateProduct(product) {
  return await adminApiRequest(
    "updateProduct",
    {
      method: "POST",
      body: product
    }
  );
}

async function adminToggleProduct(id) {
  return await adminApiRequest(
    "toggleProduct",
    {
      method: "POST",
      body: { id }
    }
  );
}

/* ==========================================================
   Orders
   ========================================================== */

async function adminFetchOrders() {
  const data = await adminApiRequest(
    "orders"
  );

  return data.orders || [];
}

async function adminUpdateOrderStatus(
  orderId,
  status
) {
  return await adminApiRequest(
    "updateOrderStatus",
    {
      method: "POST",
      body: {
        orderId,
        status
      }
    }
  );
}

/* ==========================================================
   Customers
   ========================================================== */

async function adminFetchCustomers() {
  const data = await adminApiRequest(
    "customers"
  );

  return (data.customers || []).map(
    customer => ({
      id: customer.id,

      name: customer.nombre,

      phone: customer.telefono,

      category: customer.categoria,

      notes: customer.notas,

      active:
        customer.activo === true ||
        customer.activo === "TRUE",

      orders: Number(
        customer.orders || 0
      ),

      lastPurchase:
      customer.ultimaCompra,

      createdAt: customer.createdAt,

      updatedAt: customer.updatedAt
    })
  );
}

async function adminUpdateCustomer(customer) {
  return await adminApiRequest(
    "updateCustomer",
    {
      method: "POST",

      body: {
        id: customer.id,

        nombre: customer.name,

        telefono: customer.phone,

        notas: customer.notes || ""
      }
    }
  );
}

/* ==========================================================
   Business
   ========================================================== */

async function adminFetchBusiness() {
  const data = await adminApiRequest(
    "business"
  );

  return data.business || null;
}

async function adminUpdateBusiness(
  section,
  data
) {
  return await adminApiRequest(
    "updateBusiness",
    {
      method: "POST",
      body: {
        section,
        data
      }
    }
  );
}
