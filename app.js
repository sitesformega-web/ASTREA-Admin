function renderAdminApp() {
  renderAdminHeader();
  renderAdminMain();
  renderAdminNav();
}

function renderAdminHeader() {
  const header = document.getElementById("admin-header");

  header.innerHTML = `
    <div class="brand-line">
      <a class="brand-signature" href="#" aria-label="ASTREA">
        <span class="brand-service">PANEL ADMINISTRATIVO</span>
        <span class="brand-by">by</span>
        <span class="brand-astrea">ASTREA™</span>
      </a>
    </div>

    <div class="admin-title-block">
      <h1 class="admin-title">${ADMIN_CONFIG.businessName}</h1>
      <p class="admin-subtitle">Gestioná tu negocio desde un solo lugar.</p>
    </div>
  `;
}

function renderAdminMain() {
  const main = document.getElementById("admin-main");

  if (ADMIN_STATE.currentModule === "orders") {
    renderOrdersModule(main);
    loadOrders();
    return;
  }

  if (ADMIN_STATE.currentModule === "products") {
    renderProductsModule(main);
    loadProducts();
    return;
  }

  if (ADMIN_STATE.currentModule === "customers") {
    renderCustomersModule(main);
    return;
  }

  if (ADMIN_STATE.currentModule === "business") {
    renderBusinessModule(main);
    return;
  }

  if (ADMIN_STATE.currentModule === "summary") {
    renderSummaryModule(main);
    return;
  }

  if (ADMIN_STATE.currentModule === "help") {
    renderHelpModule(main);
    return;
  }

  if (ADMIN_STATE.currentModule === "astrea") {
    renderAstreaModule(main);
    return;
  }
}

function renderAdminNav() {
  const nav = document.getElementById("admin-nav");

  const items = [
    { id: "orders", label: "Pedidos" },
    { id: "products", label: "Productos" },
    { id: "customers", label: "Clientes" },
    { id: "business", label: "Negocio" },
    { id: "summary", label: "Resumen" }
  ];

  if (isAstreaAdmin()) {
    items.push({ id: "astrea", label: "ASTREA" });
  }

  nav.className = "admin-bottom-nav";

  nav.innerHTML = items
    .map(item => `
      <button 
        class="nav-btn ${ADMIN_STATE.currentModule === item.id ? "active" : ""}"
        type="button"
        data-module="${item.id}"
      >
        ${item.label}
      </button>
    `)
    .join("");

  nav.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
      navigateTo(button.dataset.module);
    });
  });
}

renderAdminApp();
