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

    expanded: `
      <div
        class="customer-record-expanded"
        hidden
      >
        ${renderCustomerDetails(customer)}
      </div>
    `

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

      ${renderButton({
        id: `btnWhatsapp-${customer.id}`,
        label: "WhatsApp"
      })}

      ${renderButton({
        id: `btnEdit-${customer.id}`,
        label: "Editar"
      })}

      ${renderButton({
        id: `btnHistory-${customer.id}`,
        label: "Ver historial",
        variant: "secondary"
      })}

    </div>
  `;
}

/**
 * Categoría comercial.
 *
 * Temporalmente se basa en el estado activo.
 * Más adelante se calculará desde el historial
 * de compras.
 *
 * @param {Object} customer
 * @returns {string}
 */
function renderCustomerCategory(customer) {

  let label = "Inactivo";
  let css = "inactive";

  if (customer.active) {
    label = "Frecuente";
    css = "frequent";
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
    description: "Comenzá creando tu primer cliente.",
    buttonLabel: "Nuevo cliente",
    buttonId: "btnNewCustomer"
  });
}
