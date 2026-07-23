/**
 * ============================================================
 * ASTREA™ Commerce
 * Customers Module
 * UI
 * ============================================================
 */

/**
 * Renderiza el módulo Customers.
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
            >
                ${renderCustomersEmptyState()}
            </div>

        </section>
    `;

}

/**
 * Header del módulo.
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
 * Barra de búsqueda.
 *
 * @returns {string}
 */
function renderCustomersToolbar() {

    return renderSearchToolbar({
        placeholder: "Buscar cliente..."
    });

}

/**
 * Estado vacío inicial.
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
