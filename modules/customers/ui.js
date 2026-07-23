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
 * Renderiza el listado de clientes.
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
 * Renderiza una tarjeta de cliente.
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

      <div class="customer-card-header">

        <div class="customer-card-identity">

          <h3 class="customer-card-name">
            ${customer.name}
          </h3>

          ${
            customer.legalName
              ? `
                <p class="customer-card-legal-name">
                  ${customer.legalName}
                </p>
              `
              : ""
          }

        </div>

        ${renderCustomerStatus(customer.active)}

      </div>

      <div class="customer-card-details">

        ${
          customer.phone
            ? renderCustomerDetail("Teléfono", customer.phone)
            : ""
        }

        ${
          customer.email
            ? renderCustomerDetail("Email", customer.email)
            : ""
        }

        ${
          customer.taxId
            ? renderCustomerDetail("RUC", customer.taxId)
            : ""
        }

        ${
          customer.address
            ? renderCustomerDetail("Dirección", customer.address)
            : ""
        }

      </div>

      ${
        customer.notes
          ? `
            <p class="customer-card-notes">
              ${customer.notes}
            </p>
          `
          : ""
      }

    </article>
  `;
}

/**
 * Renderiza un dato individual del cliente.
 *
 * @param {string} label
 * @param {string} value
 * @returns {string}
 */
function renderCustomerDetail(label, value) {
  return `
    <div class="customer-detail">

      <span class="customer-detail-label">
        ${label}
      </span>

      <span class="customer-detail-value">
        ${value}
      </span>

    </div>
  `;
}

/**
 * Renderiza el estado del cliente.
 *
 * @param {boolean} active
 * @returns {string}
 */
function renderCustomerStatus(active) {
  return `
    <span class="customer-status ${active ? "is-active" : "is-inactive"}">
      ${active ? "Activo" : "Inactivo"}
    </span>
  `;
}

/**
 * Renderiza el estado vacío.
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
