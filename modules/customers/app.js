/**
 * ============================================================
 * ASTREA™ Commerce
 * Customers Module
 * Application
 * ============================================================
 */

const customers = await adminFetchCustomers();

setCustomers(customers);

/**
 * Inicializa el módulo Customers.
 */
function loadCustomers() {
  setCustomers(CUSTOMERS_DEMO_DATA);

  renderCustomersView();
}

/**
 * Renderiza el contenido principal del módulo
 * según el estado actual.
 */
function renderCustomersView() {
  const container = document.getElementById("customersView");

  if (!container) return;

  const customers = ADMIN_STATE.customers;

  container.innerHTML = customers.length
    ? renderCustomersList(customers)
    : renderCustomersEmptyState();

  bindCustomersEvents();
  bindCustomerRecordEvents();
}

/**
 * Registra los eventos generales disponibles
 * en la vista.
 */
function bindCustomersEvents() {
  const btnNewCustomer = document.getElementById("btnNewCustomer");

  if (btnNewCustomer) {
    btnNewCustomer.addEventListener("click", handleNewCustomer);
  }
}

/**
 * Registra la apertura y cierre de los detalles
 * de cada cliente.
 */
function bindCustomerRecordEvents() {
  const summaries = document.querySelectorAll(
    ".customer-record-summary"
  );

  summaries.forEach(summary => {
    summary.addEventListener("click", handleCustomerRecordToggle);
  });
}

/**
 * Abre o cierra el detalle de un cliente.
 *
 * @param {MouseEvent} event
 */
function handleCustomerRecordToggle(event) {
  const summary = event.currentTarget;

  const card = summary.closest(".ui-card");

  if (!card) return;

  const expanded = card.querySelector(".ui-card-expanded");

  if (!expanded) return;

  expanded.classList.toggle("is-open");
}

/**
 * Acción temporal para iniciar la creación
 * de un nuevo cliente.
 */
function handleNewCustomer() {
  setCreatingCustomer(true);

  console.log("[Customers] Nuevo cliente");
}
