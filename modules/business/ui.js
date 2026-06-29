function renderBusinessModule(container) {
  container.innerHTML = `
    <section class="admin-card">

      <h2>🏪 Mi negocio</h2>

      ${renderEmptyState("Módulo en construcción.")}

    </section>
  `;
}