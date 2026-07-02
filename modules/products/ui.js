function renderProductsModule(container) {
  container.innerHTML = `
    <section class="products-module">

      <div class="products-header">

        <div>
          <h2>🛒 Productos</h2>
          <p>Administrá el catálogo de tu negocio.</p>
        </div>

        <button
          class="ui-button primary"
          id="newProductBtn"
          type="button"
        >
          + Nuevo producto
        </button>

      </div>

      <div class="products-search">

        <input
          id="productsSearch"
          type="search"
          placeholder="Buscar producto..."
        >

      </div>

      <div id="productsView">

        ${renderEmptyState("Cargando productos...")}

      </div>

    </section>
  `;
}
