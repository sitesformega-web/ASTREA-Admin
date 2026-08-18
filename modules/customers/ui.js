/**
 * ============================================================
 * ASTREA™ Commerce
 * Customers Module
 * UI
 * ============================================================
 */

/**
 * Renderiza la estructura principal del módulo.
 *
 * @param {HTMLElement} container
 */
function renderCustomersModule(container) {
  if (!container) return;

  container.innerHTML = `
    <section class="customers-module">

      ${renderCustomersHeader()}

      ${renderCustomersToolbar()}

      <div
        id="customersView"
        class="customers-view"
      ></div>

    </section>
  `;
}

/**
 * Encabezado del módulo.
 */
function renderCustomersHeader() {
  return renderModuleHeader({
    title: "Clientes",
    subtitle: "Administrá la cartera de clientes."
  });
}

/**
 * Barra de búsqueda.
 */
function renderCustomersToolbar() {
  return renderSearchToolbar({
    placeholder: "Buscar cliente..."
  });
}

/**
 * Listado.
 *
 * @param {Array} customers
 * @returns {string}
 */
function renderCustomersList(customers) {
  return `
    <div class="customers-list">
      ${customers.map(renderCustomerRecord).join("")}
    </div>
  `;
}

/**
 * Registro de cliente.
 *
 * @param {Object} customer
 * @returns {string}
 */
function renderCustomerRecord(customer) {
  return renderCard({
    body: renderCustomerSummary(customer),
    expanded: renderCustomerExpanded(customer)
  });
}

/**
 * Resumen del cliente.
 *
 * @param {Object} customer
 * @returns {string}
 */
function renderCustomerSummary(customer) {
  return `
    <div
      class="customer-record-summary"
      data-customer-id="${customer.id}"
    >
      <div class="customer-record-main">

        <h3 class="customer-record-name">
          ${customer.name}
        </h3>

        ${
          customer.phone
            ? `
              <p class="customer-record-phone">
                ${customer.phone}
              </p>
            `
            : ""
        }

        ${renderCustomerCategory(customer)}

      </div>
    </div>
  `;
}

/**
 * Contenido expandido.
 *
 * @param {Object} customer
 * @returns {string}
 */
function renderCustomerExpanded(customer) {
  const editing =
    ADMIN_STATE.editingCustomerId === customer.id;

  return editing
    ? renderCustomerEditor(customer)
    : renderCustomerDetails(customer);
}

/**
 * Detalle del cliente.
 *
 * @param {Object} customer
 * @returns {string}
 */
function renderCustomerDetails(customer) {
  return `
    <div class="customer-record-details">

      <div class="customer-record-field">
        <strong>Última compra</strong>
        <span>${customer.lastPurchase || "Sin compras"}</span>
      </div>

      <div class="customer-record-field">
        <strong>Pedidos</strong>
        <span>${customer.orders ?? 0}</span>
      </div>

      ${
        customer.notes
          ? `
            <div class="customer-record-field">
              <strong>Notas</strong>
              <span>${customer.notes}</span>
            </div>
          `
          : ""
      }

    </div>

    <div class="customer-record-actions">

      ${renderButton(
        "WhatsApp",
        {
          id: `btnWhatsapp-${customer.id}`
        }
      )}

      ${renderButton(
        "Editar",
        {
          id: `btnEdit-${customer.id}`
        }
      )}

      ${renderButton(
        "Ver historial",
        {
          id: `btnHistory-${customer.id}`,
          type: "secondary"
        }
      )}

    </div>
  `;
}

/**
 * Formulario de edición.
 *
 * @param {Object} customer
 * @returns {string}
 */
function renderCustomerEditor(customer) {
  return `
    <div class="customer-record-editor">

      <label>
        Nombre

        <input
          id="customer-name-${customer.id}"
          type="text"
          value="${customer.name || ""}"
          maxlength="120"
          autocomplete="off"
        >
      </label>

      <label>
        Teléfono

        <input
          id="customer-phone-${customer.id}"
          type="text"
          value="${customer.phone || ""}"
          maxlength="30"
          autocomplete="off"
        >
      </label>

      <label>
        Notas

        <textarea
          id="customer-notes-${customer.id}"
          rows="4"
          maxlength="500"
        >${customer.notes || ""}</textarea>
      </label>

      <div class="customer-record-actions">

        ${renderButton(
          "Guardar cambios",
          {
            id: `btnSaveCustomer-${customer.id}`
          }
        )}

        ${renderButton(
          "Cancelar",
          {
            id: `btnCancelCustomer-${customer.id}`,
            type: "secondary"
          }
        )}

      </div>

    </div>
  `;
}

/**
 * Categoría comercial.
 *
 * @param {Object} customer
 * @returns {string}
 */
function renderCustomerCategory(customer) {
  let label = "Frecuente";
  let css = "frequent";

  if (customer.category === "occasional") {
    label = "Ocasional";
    css = "occasional";
  }

  if (customer.category === "inactive") {
    label = "Inactivo";
    css = "inactive";
  }

  return `
    <p class="customer-record-category ${css}">
      <span class="customer-record-bullet"></span>
      ${label}
    </p>
  `;
}

/**
 * Estado vacío.
 */
function renderCustomersEmptyState() {
  return renderEmptyState({
    title: "No hay clientes registrados.",
    description: "Los clientes se registrarán automáticamente con los pedidos."
  });
}
