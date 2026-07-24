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
 * Renderiza el encabezado del módulo.
 *
 * @returns {string}
 */
function renderCustomersHeader() {
  return renderModuleHeader({
    title: "Clientes",
    subtitle: "Administrá la cartera de clientes."
  });
}

/**
 * Renderiza la barra de búsqueda.
 *
 * @returns {string}
 */
function renderCustomersToolbar() {
  return renderSearchToolbar({
    placeholder: "Buscar cliente..."
  });
}

/**
 * Renderiza el listado.
 *
 * @param {Array} customers
 * @returns {string}
 */
function renderCustomersList(customers) {
  return `
    <div class="customers-list">
      ${customers.map(renderCustomerCard).join("")}
    </div>
  `;
}

/**
 * Renderiza una tarjeta.
 *
 * @param {Object} customer
 * @returns {string}
 */
function renderCustomerCard(customer) {
  return `
    <article
      class="customer-card ${customer.active ? "" : "is-inactive"}"
      data-customer-id="${customer.id}"
    >

      <header class="customer-card-header">

        <button
          class="customer-card-toggle"
          type="button"
          aria-label="Expandir cliente"
        >
          ▼
        </button>

        <div class="customer-card-body">

          <div class="customer-card-title">

            <h3 class="customer-card-name">
              ${customer.name}
            </h3>

            ${renderCustomerStatus(customer.active)}

          </div>

          ${
            customer.phone
              ? `
                <p class="customer-card-phone">
                  📱 ${customer.phone}
                </p>
              `
              : ""
          }

        </div>

      </header>

      <footer class="customer-card-actions">

        <button
          class="customer-action"
          type="button"
          data-action="whatsapp"
        >
          💬 WhatsApp
        </button>

        <button
          class="customer-action"
          type="button"
          data-action="edit"
        >
          ✏ Editar
        </button>

      </footer>

      <div class="customer-card-content"></div>

    </article>
  `;
}

/**
 * Estado comercial.
 *
 * @param {boolean} active
 * @returns {string}
 */
function renderCustomerStatus(active) {
  return `
    <span class="customer-status ${active ? "is-active" : "is-inactive"}">
      ${active ? "Frecuente" : "Ocasional"}
    </span>
  `;
}

/**
 * Estado vacío.
 *
 * @returns {string}
 */
function renderCustomersEmptyState() {
  return renderEmptyState({
    title: "No hay clientes registrados.",
    description: "Comenzá creando tu primer cliente.",
    buttonLabel: "Nuevo cliente",
    buttonId: "btnNewCustomer"
  });
}
