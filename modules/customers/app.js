/**
 * ============================================================
 * ASTREA™ Commerce
 * Customers Module
 * Application
 * ============================================================
 */

/**
 * Datos temporales para validar el módulo.
 *
 * Más adelante serán reemplazados por la carga real
 * desde la fuente de datos oficial.
 */
const CUSTOMERS_DEMO_DATA = [
  {
    id: "customer-001",
    name: "María González",
    legalName: "",
    taxId: "",
    phone: "0981 123 456",
    email: "maria@example.com",
    address: "Asunción",
    notes: "Prefiere recibir mensajes por WhatsApp.",
    category: "frequent"
    lastPurchase: "Hace 3 días",
    orders: 12,
    createdAt: "2026-07-23T10:00:00.000Z",
    updatedAt: "2026-07-23T10:00:00.000Z"
  },
  {
    id: "customer-002",
    name: "Comercial San Miguel",
    legalName: "Comercial San Miguel S.R.L.",
    taxId: "80012345-6",
    phone: "0972 456 789",
    email: "",
    address: "San Lorenzo",
    notes: "",
    category: "frequent"
    lastPurchase: "Hace 8 días",
    orders: 7,
    createdAt: "2026-07-23T10:10:00.000Z",
    updatedAt: "2026-07-23T10:10:00.000Z"
  },
  {
    id: "customer-003",
    name: "Carlos Benítez",
    legalName: "",
    taxId: "",
    phone: "0994 789 123",
    email: "carlos@example.com",
    address: "",
    notes: "Cliente ocasional.",
    category: "inactive"
    lastPurchase: "Hace 4 meses",
    orders: 2,
    createdAt: "2026-07-23T10:20:00.000Z",
    updatedAt: "2026-07-23T10:20:00.000Z"
  }
];

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
