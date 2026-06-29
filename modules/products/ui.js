function renderProductsModule(container) {
  container.innerHTML = `
    <section class="admin-card">

      <h2>🛒 Productos</h2>

      ${renderEmptyState("Módulo en construcción.")}

    </section>
  `;
}