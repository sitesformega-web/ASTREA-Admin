/**
 * ============================================================
 * ASTREA™ Commerce
 * Customers Module
 * Application
 * ============================================================
 */

/**
 * Inicializa el módulo Customers.
 */
function loadCustomers() {

    renderCustomersView();

}

/**
 * Renderiza el contenido principal del módulo.
 */
function renderCustomersView() {

    const container =
        document.getElementById("customersView");

    if (!container) return;

    container.innerHTML =
        renderCustomersEmptyState();

    bindCustomersEvents();

}

/**
 * Registra los eventos del módulo.
 */
function bindCustomersEvents() {

    const btnNewCustomer =
        document.getElementById("btnNewCustomer");

    if (btnNewCustomer) {

        btnNewCustomer.addEventListener(
            "click",
            handleNewCustomer
        );

    }

}

/**
 * Acción inicial para crear un nuevo cliente.
 *
 * Esta funcionalidad será implementada
 * durante la siguiente fase del Sprint.
 */
function handleNewCustomer() {

    console.log(
        "[Customers] Nuevo cliente"
    );

}
