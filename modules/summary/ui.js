function renderSummaryModule(container) {
  container.innerHTML = `
    <section class="admin-card">

      <h2>📈 Resumen</h2>

      ${renderEmptyState("Módulo en construcción.")}

    </section>
  `;
}