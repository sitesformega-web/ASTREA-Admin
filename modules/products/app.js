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
     initializeProductEnhancements();

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

  ADMIN_STATE.creatingProduct = false;

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

  if (
    !validateExistingProductForm(productId)
  ) {

    showToast(
      "Revisá los campos marcados.",
      "error"
    );

    return;

  }

  const button =
    document.querySelector(
      `[data-save-product="${productId}"]`
    );

  setLoadingButton(
    button,
    "Guardando..."
  );

  try {

    const product =
      readProductForm(productId);

    await adminUpdateProduct(product);

    const index =
      ADMIN_STATE.products.findIndex(
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

  } finally {

    clearLoadingButton(button);

  }

}

async function toggleProduct(productId) {

  const product =
    ADMIN_STATE.products.find(
      item => item.id === productId
    );

  if (!product) return;

  const isActive =
    product.activo === true ||
    product.activo === "TRUE";

  confirmDialog({

    title: isActive
      ? "Desactivar producto"
      : "Activar producto",

    message: isActive
      ? "El producto dejará de aparecer en la vitrina pública.\n\nPodrás volver a activarlo cuando quieras."
      : "El producto volverá a estar disponible para los clientes.",

    confirmText: isActive
      ? "Desactivar"
      : "Activar",

    confirmStyle: isActive
      ? "danger"
      : "primary",

    onConfirm: async () => {

      try {

        await adminToggleProduct(productId);

        product.activo = !isActive;

        showToast(
          isActive
            ? "Producto desactivado."
            : "Producto activado.",
          "success"
        );

        renderProductsView();

      }

      catch (error) {

        console.error(error);

        showToast(
          "No se pudo actualizar el estado.",
          "error"
        );

      }

    }

  });

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

      initializeProductEnhancements();

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

  console.log("createProduct ejecutado");
  
   if (!validateNewProductForm()) {

    showToast(
      "Revisá los campos marcados.",
      "error"
    );

    return;

  }

  const button =
    document.getElementById(
      "saveNewProduct"
    );

  setLoadingButton(
    button,
    "Creando..."
  );

  try {

    const product = {

      nombre:
        document
          .getElementById(
            "new-product-name"
          )
          .value
          .trim(),

      categoria:
        document
          .getElementById(
            "new-product-category"
          )
          .value
          .trim(),

      tipoVenta:
        document
          .getElementById(
            "new-product-type"
          )
          .value,

      precioUnidad:
        Number(
          document
            .getElementById(
              "new-product-unit"
            )
            .value
        ) || "",

      precioKg:
        Number(
          document
            .getElementById(
              "new-product-weight"
            )
            .value
        ) || "",

      stock:
        Number(
          document
            .getElementById(
              "new-product-stock"
            )
            .value
        ) || "",

      imagen:
        document
          .getElementById(
            "new-product-image"
          )
          .value
          .trim(),

      orden:
        Number(
          document
            .getElementById(
              "new-product-order"
            )
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

  } finally {

    clearLoadingButton(button);

  }

}
/* ==========================================================
   Sprint 2.1 Enhancements
   ========================================================== */

function initializeProductEnhancements() {

  initializeProductPreview();

  initializeProductTypeToggle();

  initializeProductValidation();

}

/* ==========================================================
   Enhancement 001
   Preview automática
   ========================================================== */

function initializeProductPreview() {

  // Preview del formulario Nuevo Producto

  const newImage =
    document.getElementById("new-product-image");

  const newPreview =
    document.getElementById("new-product-preview");

  if (newImage && newPreview) {

    newImage.oninput = () => {

      const url = newImage.value.trim();

      if (!url) {

        newPreview.style.display = "none";

        return;

      }

      newPreview.src = url;

      newPreview.style.display = "";

    };

  }

  // Preview de productos existentes

  ADMIN_STATE.products.forEach(product => {

    const input =
      document.getElementById(
        `product-image-${product.id}`
      );

    const preview =
      document.getElementById(
        `product-preview-${product.id}`
      );

    if (!input || !preview) return;

    input.oninput = () => {

      const url =
        input.value.trim();

      if (!url) {

        preview.style.display = "none";

        return;

      }

      preview.src = url;

      preview.style.display = "";

    };

  });

}

/* ==========================================================
   Enhancement 002
   Cambio tipo de venta
   ========================================================== */

function initializeProductTypeToggle() {

  // Nuevo producto

  const newType =
    document.getElementById("new-product-type");

  const newUnit =
    document.getElementById("new-unit-price-group");

  const newWeight =
    document.getElementById("new-weight-price-group");

  if (newType && newUnit && newWeight) {

    const updateNewGroups = () => {

      const isUnit =
        newType.value === "unit";

      newUnit.style.display =
        isUnit ? "" : "none";

      newWeight.style.display =
        isUnit ? "none" : "";

    };

    updateNewGroups();

    newType.onchange = updateNewGroups;

  }

  // Productos existentes

  ADMIN_STATE.products.forEach(product => {

    const type =
      document.getElementById(
        `product-type-${product.id}`
      );

    const unit =
      document.getElementById(
        `unit-price-group-${product.id}`
      );

    const weight =
      document.getElementById(
        `weight-price-group-${product.id}`
      );

    if (!type || !unit || !weight) return;

    const updateGroups = () => {

      const isUnit =
        type.value === "unit";

      unit.style.display =
        isUnit ? "" : "none";

      weight.style.display =
        isUnit ? "none" : "";

    };

    updateGroups();

    type.onchange = updateGroups;

  });

}

/* ==========================================================
   Enhancement 003
   Validaciones de Productos
   ========================================================== */

function initializeProductValidation() {

  if (
    document.documentElement.dataset
      .productValidationBound === "true"
  ) {
    return;
  }

  document.documentElement.dataset
    .productValidationBound = "true";

  /*
   * Limpia el error mientras el usuario
   * corrige un campo.
   */
  document.addEventListener(
    "input",
    event => {

      const field =
        event.target.closest(
          ".product-detail input, " +
          ".product-detail select"
        );

      if (!field) return;

      clearProductFieldError(field);

    },
    true
  );

}

function validateNewProductForm() {

  const name =
    document.getElementById(
      "new-product-name"
    );

  const category =
    document.getElementById(
      "new-product-category"
    );

  const image =
    document.getElementById(
      "new-product-image"
    );

  const type =
    document.getElementById(
      "new-product-type"
    );

  const unitPrice =
    document.getElementById(
      "new-product-unit"
    );

  const weightPrice =
    document.getElementById(
      "new-product-weight"
    );

  let isValid = true;

  clearProductFieldError(name);
  clearProductFieldError(category);
  clearProductFieldError(image);
  clearProductFieldError(unitPrice);
  clearProductFieldError(weightPrice);

  if (!name.value.trim()) {

    setProductFieldError(
      name,
      "Ingresá el nombre del producto."
    );

    isValid = false;

  }

  if (!category.value.trim()) {

    setProductFieldError(
      category,
      "Ingresá una categoría."
    );

    isValid = false;

  }

  if (
    image.value.trim() &&
    !isValidProductUrl(image.value.trim())
  ) {

    setProductFieldError(
      image,
      "Ingresá una URL válida."
    );

    isValid = false;

  }

  if (type.value === "unit") {

    if (!isPositivePrice(unitPrice.value)) {

      setProductFieldError(
        unitPrice,
        "Ingresá un precio mayor a cero."
      );

      isValid = false;

    }

  } else {

    if (!isPositivePrice(weightPrice.value)) {

      setProductFieldError(
        weightPrice,
        "Ingresá un precio mayor a cero."
      );

      isValid = false;

    }

  }

  return isValid;

}

function validateExistingProductForm(
  productId
) {

  const name =
    document.getElementById(
      `product-name-${productId}`
    );

  const category =
    document.getElementById(
      `product-category-${productId}`
    );

  const image =
    document.getElementById(
      `product-image-${productId}`
    );

  const type =
    document.getElementById(
      `product-type-${productId}`
    );

  const unitPrice =
    document.getElementById(
      `product-unit-price-${productId}`
    );

  const weightPrice =
    document.getElementById(
      `product-weight-price-${productId}`
    );

  let isValid = true;

  clearProductFieldError(name);
  clearProductFieldError(category);
  clearProductFieldError(image);
  clearProductFieldError(unitPrice);
  clearProductFieldError(weightPrice);

  if (!name.value.trim()) {

    setProductFieldError(
      name,
      "Ingresá el nombre del producto."
    );

    isValid = false;

  }

  if (!category.value.trim()) {

    setProductFieldError(
      category,
      "Ingresá una categoría."
    );

    isValid = false;

  }

  if (
    image.value.trim() &&
    !isValidProductUrl(image.value.trim())
  ) {

    setProductFieldError(
      image,
      "Ingresá una URL válida."
    );

    isValid = false;

  }

  if (type.value === "unit") {

    if (!isPositivePrice(unitPrice.value)) {

      setProductFieldError(
        unitPrice,
        "Ingresá un precio mayor a cero."
      );

      isValid = false;

    }

  } else {

    if (!isPositivePrice(weightPrice.value)) {

      setProductFieldError(
        weightPrice,
        "Ingresá un precio mayor a cero."
      );

      isValid = false;

    }

  }

  return isValid;

}

function setProductFieldError(
  field,
  message
) {

  if (!field) return;

  field.classList.add("is-invalid");

  field.setAttribute(
    "aria-invalid",
    "true"
  );

  const label =
    field.closest("label");

  const error =
    label
      ? label.querySelector(
          ".product-field-error"
        )
      : null;

  if (error) {

    error.textContent = message;

  }

}

function clearProductFieldError(field) {

  if (!field) return;

  field.classList.remove("is-invalid");

  field.removeAttribute(
    "aria-invalid"
  );

  const label =
    field.closest("label");

  const error =
    label
      ? label.querySelector(
          ".product-field-error"
        )
      : null;

  if (error) {

    error.textContent = "";

  }

}

function isPositivePrice(value) {

  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return false;
  }

  const price = Number(value);

  return (
    Number.isFinite(price) &&
    price > 0
  );

}

function isValidProductUrl(value) {

  try {

    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );

  } catch (error) {

    return false;

  }

}
