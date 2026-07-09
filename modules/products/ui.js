/* ==========================================================
   ASTREA™ Commerce
   Admin Products Module

   Archivo:
   ui.js

   Versión:
   Products Module v1.1

   Sprint:
   Capítulo II / Sprint 2.1

   Estado:
   Base UX preparada

   Cambios principales:
   - Formulario preparado para validaciones.
   - Preview de imagen preparada.
   - Campos de precio separados por tipo de venta.
   - Estructura lista para lógica mejorada desde app.js.
   ========================================================== */

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

          Nombre *

          <input
            id="new-product-name"
            required
            maxlength="120"
            autocomplete="off"
          >

          <small
            class="product-field-error"
            id="new-product-name-error"
          ></small>

        </label>

        <label>

          Imagen (URL)

          <input
            id="new-product-image"
            type="url"
            placeholder="https://..."
            autocomplete="off"
          >

          <small
            class="product-field-error"
            id="new-product-image-error"
          ></small>

        </label>

        <img
          id="new-product-preview"
          class="product-preview"
          style="display:none;"
          alt="Vista previa del producto"
        >

        <label>

          Categoría *

          <input
            id="new-product-category"
            required
            autocomplete="off"
          >

          <small
            class="product-field-error"
            id="new-product-category-error"
          ></small>

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

        <div
          id="new-unit-price-group"
          class="product-price-group"
        >

          <label>

            Precio por unidad *

            <input
              id="new-product-unit"
              type="number"
              min="0"
              step="0.01"
              inputmode="decimal"
            >

            <small
              class="product-field-error"
              id="new-product-unit-error"
            ></small>

          </label>

        </div>

        <div
          id="new-weight-price-group"
          class="product-price-group"
          style="display:none;"
        >

          <label>

            Precio por kilo *

            <input
              id="new-product-weight"
              type="number"
              min="0"
              step="0.01"
              inputmode="decimal"
            >

            <small
              class="product-field-error"
              id="new-product-weight-error"
            ></small>

          </label>

        </div>

        <details class="product-more">

          <summary>
            Más opciones
          </summary>

          <label>

            Stock

            <input
              id="new-product-stock"
              type="number"
              min="0"
              step="1"
              inputmode="numeric"
            >

          </label>

          <label>

            Orden

            <input
              id="new-product-order"
              type="number"
              min="1"
              step="1"
              value="999"
              inputmode="numeric"
            >

          </label>

        </details>

        <div class="product-actions">

          <button
            id="saveNewProduct"
            class="ui-button primary"
            type="button"
          >

            Crear producto

          </button>

          <button
            id="cancelNewProduct"
            class="ui-button secondary"
            type="button"
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
