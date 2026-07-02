function renderProductsModule(container) {

  container.innerHTML = `

    <section class="products-module">

      ${renderProductsHeader()}

      ${renderProductsToolbar()}

      <div id="productsView">

        ${renderEmptyState(
          "Cargando productos..."
        )}

      </div>

    </section>

  `;

}

function renderProductsHeader() {

  return `

    <div class="products-header">

      <div>

        <h2>🛒 Productos</h2>

        <p>

          Administrá el catálogo de tu negocio.

        </p>

      </div>

      <button
        id="newProductBtn"
        class="ui-button primary"
        type="button"
      >

        + Nuevo producto

      </button>

    </div>

  `;

}

function renderProductsToolbar() {

  return `

    <div class="products-search">

      <input

        id="productsSearch"

        type="search"

        placeholder="Buscar producto..."

        autocomplete="off"

      >

    </div>

  `;

}
function renderProductCreator() {

  return `

    <article class="product-card">

      <div class="product-detail">

        <label>

          Nombre

          <input
            id="new-product-name"
          >

        </label>

        <label>

          Imagen

          <input
            id="new-product-image"
          >

        </label>

        <img
          id="new-product-preview"
          class="product-preview"
          style="display:none;"
        >

        <label>

          Categoría

          <input
            id="new-product-category"
          >

        </label>

        <label>

          Tipo de venta

          <select
            id="new-product-type"
          >

            <option value="unit">

              Por unidad

            </option>

            <option value="weight">

              Por peso

            </option>

          </select>

        </label>

        <label>

          Precio por unidad

          <input
            id="new-product-unit"
            type="number"
          >

        </label>

        <label>

          Precio por kilo

          <input
            id="new-product-weight"
            type="number"
          >

        </label>

        <details class="product-more">

          <summary>

            Más opciones

          </summary>

          <label>

            Stock

            <input
              id="new-product-stock"
              type="number"
            >

          </label>

          <label>

            Orden

            <input
              id="new-product-order"
              type="number"
              value="999"
            >

          </label>

        </details>

        <div class="product-actions">

          <button

            id="saveNewProduct"

            class="ui-button primary"

          >

            Crear producto

          </button>

          <button

            id="cancelNewProduct"

            class="ui-button secondary"

          >

            Cancelar

          </button>

        </div>

      </div>

    </article>

  `;

}
function mountProductCreator() {

  const container =
    document.getElementById("productsView");

  if (!container) return;

  container.insertAdjacentHTML(

    "afterbegin",

    renderProductCreator()

  );

}
