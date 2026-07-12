/* ==========================================================
   ASTREA™ Admin
   Products Module
   app.js
   ========================================================== */

async function loadProducts() {

  try {

    const products = await adminFetchProducts();

    setProducts(products);

    renderProductsView();
     initializeProductsModule();

  } catch (error) {

    console.error(error);

    showToast(
      "No se pudieron cargar los productos.",
      "error"
    );

  }

}

function renderProductsView() {

  const container = document.getElementById("productsView");

  if (!container) return;

  const search = getProductsSearch();

  const products = ADMIN_STATE.products.filter(product => {

    if (!search) return true;

    return (
      String(product.nombre || "")
        .toLowerCase()
        .includes(search)

      ||

      String(product.categoria || "")
        .toLowerCase()
        .includes(search)
    );

  });

  if (!products.length) {

    container.innerHTML = renderEmptyState(
      "No se encontraron productos."
    );

    bindProductsEvents();

    return;

  }

  container.innerHTML = `

    <div class="products-list">

      ${products
        .sort(compareProducts)
        .map(renderProductCard)
        .join("")}

    </div>

  `;

  bindProductsEvents();

}

function renderProductCard(product) {

  const expanded =
    ADMIN_STATE.expandedProductId === product.id;

  return `

    <article class="product-card">

      <div
        class="product-card-header"
        data-expand-product="${product.id}"
      >

        <div class="product-main">

          <img
            class="product-image"
            src="${product.imagen || ""}"
            alt="${product.nombre}"
            onerror="this.src='https://placehold.co/200x200?text=ASTREA';"
          >

          <div>

            <div class="product-name">

              ${product.nombre}

            </div>

            <div class="product-category">

              ${product.categoria}

            </div>

          </div>

        </div>

        <div class="product-state">

          ${product.activo === true ||
            product.activo === "TRUE"

              ? "🟢 Activo"

              : "⚪ Inactivo"}

        </div>

      </div>

      ${expanded
        ? renderProductEditor(product)
        : ""}

    </article>

  `;

}

function renderProductEditor(product) {

  return `

    <div class="product-detail">

      <label>

        Nombre

        <input
          id="product-name-${product.id}"
          value="${product.nombre || ""}"
        >

      </label>

      <label>

        Imagen

        <input
          id="product-image-${product.id}"
          value="${product.imagen || ""}"
        >

      </label>

      <img
        class="product-preview"
        src="${product.imagen || ""}"
        onerror="this.style.display='none';"
      >

      <label>

        Categoría

        <input
          id="product-category-${product.id}"
          value="${product.categoria || ""}"
        >

      </label>
            <label>

        Tipo de venta

        <select
          id="product-type-${product.id}"
        >

          <option
            value="unit"
            ${product.tipoVenta === "unit" ? "selected" : ""}
          >
            Por unidad
          </option>

          <option
            value="weight"
            ${product.tipoVenta === "weight" ? "selected" : ""}
          >
            Por peso
          </option>

        </select>

      </label>

      <label>

        Precio por unidad

        <input
          id="product-unit-price-${product.id}"
          type="number"
          value="${product.precioUnidad || ""}"
        >

      </label>

      <label>

        Precio por kilo

        <input
          id="product-weight-price-${product.id}"
          type="number"
          value="${product.precioKg || ""}"
        >

      </label>

      <details class="product-more">

        <summary>

          Más opciones

        </summary>

        <label>

          Stock

          <input
            id="product-stock-${product.id}"
            type="number"
            value="${product.stock || ""}"
          >

        </label>

        <label>

          Orden

          <input
            id="product-order-${product.id}"
            type="number"
            value="${product.orden || 999}"
          >

        </label>

      </details>

      <div class="product-actions">

        <button
          class="ui-button primary"
          data-save-product="${product.id}"
        >

          Guardar cambios

        </button>

        <button
          class="ui-button secondary"
          data-toggle-product="${product.id}"
        >

          ${product.activo === true ||
            product.activo === "TRUE"

              ? "Desactivar producto"

              : "Activar producto"}

        </button>

      </div>

    </div>

  `;

}

function bindProductsEvents() {

  const searchInput =
    document.getElementById("productsSearch");

  if (searchInput) {

    searchInput.value =
      ADMIN_STATE.productsSearch || "";

    searchInput.addEventListener("input", event => {

      ADMIN_STATE.productsSearch =
        event.target.value
          .trim()
          .toLowerCase();

      renderProductsView();

    });

  }

  document
    .querySelectorAll("[data-expand-product]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const id =
          button.dataset.expandProduct;

        if (
          ADMIN_STATE.expandedProductId === id
        ) {

          ADMIN_STATE.expandedProductId = null;

        } else {

          ADMIN_STATE.expandedProductId = id;

        }

        renderProductsView();

      });

    });

  document
    .querySelectorAll("[data-save-product]")
    .forEach(button => {

      button.addEventListener("click", () => {

        saveProduct(
          button.dataset.saveProduct
        );

      });

    });

  document
    .querySelectorAll("[data-toggle-product]")
    .forEach(button => {

      button.addEventListener("click", () => {

        toggleProduct(
          button.dataset.toggleProduct
        );

      });

    });

}
async function saveProduct(productId) {

  try {

    const product = readProductForm(productId);

    await adminUpdateProduct(product);

    const index = ADMIN_STATE.products.findIndex(
      item => item.id === product.id
    );

    if (index >= 0) {
      ADMIN_STATE.products[index] = {
        ...ADMIN_STATE.products[index],
        ...product
      };
    }

    showToast(
      "Producto actualizado correctamente.",
      "success"
    );

    renderProductsView();

  } catch (error) {

    console.error(error);

    showToast(
      "No se pudo actualizar el producto.",
      "error"
    );

  }

}

async function toggleProduct(productId) {

  try {

    await adminToggleProduct(productId);

    const product = ADMIN_STATE.products.find(
      item => item.id === productId
    );

    if (product) {

      product.activo =
        !(product.activo === true ||
          product.activo === "TRUE");

    }

    showToast(
      "Estado actualizado.",
      "success"
    );

    renderProductsView();

  } catch (error) {

    console.error(error);

    showToast(
      "No se pudo actualizar el estado.",
      "error"
    );

  }

}

function readProductForm(productId) {

  return {

    id: productId,

    nombre: document.getElementById(
      `product-name-${productId}`
    ).value.trim(),

    categoria: document.getElementById(
      `product-category-${productId}`
    ).value.trim(),

    tipoVenta: document.getElementById(
      `product-type-${productId}`
    ).value,

    precioUnidad: Number(
      document.getElementById(
        `product-unit-price-${productId}`
      ).value
    ) || "",

    precioKg: Number(
      document.getElementById(
        `product-weight-price-${productId}`
      ).value
    ) || "",

    stock: Number(
      document.getElementById(
        `product-stock-${productId}`
      ).value
    ) || "",

    imagen: document.getElementById(
      `product-image-${productId}`
    ).value.trim(),

    orden: Number(
      document.getElementById(
        `product-order-${productId}`
      ).value
    ) || 999

  };

}

function getProductsSearch() {

  return (
    ADMIN_STATE.productsSearch || ""
  )
    .trim()
    .toLowerCase();

}

function compareProducts(a, b) {

  const orderA = Number(a.orden || 999);
  const orderB = Number(b.orden || 999);

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return String(a.nombre)
    .localeCompare(
      String(b.nombre),
      "es"
    );

}
/* ==========================================================
   Nuevo producto
   ========================================================== */

function initializeProductsModule() {

  const newButton =
    document.getElementById("newProductBtn");

  if (newButton) {

    newButton.addEventListener("click", () => {

      if (ADMIN_STATE.creatingProduct) return;

      ADMIN_STATE.creatingProduct = true;

      mountProductCreator();

      bindCreateProductEvents();

    });

  }

}

function bindCreateProductEvents() {

  const cancel =
    document.getElementById("cancelNewProduct");

  if (cancel) {

    cancel.addEventListener("click", () => {

      ADMIN_STATE.creatingProduct = false;

      renderProductsView();

    });

  }

  const save =
    document.getElementById("saveNewProduct");

  if (save) {

    save.addEventListener("click", createProduct);

  }

}

async function createProduct() {

  try {

    const product = {

      nombre:
        document
          .getElementById("new-product-name")
          .value
          .trim(),

      categoria:
        document
          .getElementById("new-product-category")
          .value
          .trim(),

      tipoVenta:
        document
          .getElementById("new-product-type")
          .value,

      precioUnidad:
        Number(
          document
            .getElementById("new-product-unit")
            .value
        ) || "",

      precioKg:
        Number(
          document
            .getElementById("new-product-weight")
            .value
        ) || "",

      stock:
        Number(
          document
            .getElementById("new-product-stock")
            .value
        ) || "",

      imagen:
        document
          .getElementById("new-product-image")
          .value
          .trim(),

      orden:
        Number(
          document
            .getElementById("new-product-order")
            .value
        ) || 999

    };

    await adminCreateProduct(product);

    ADMIN_STATE.creatingProduct = false;

    await loadProducts();

    showToast(
      "Producto creado correctamente.",
      "success"
    );

  } catch (error) {

    console.error(error);

    showToast(
      "No se pudo crear el producto.",
      "error"
    );

  }

}
