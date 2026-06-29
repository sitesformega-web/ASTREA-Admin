function renderOrdersModule(container) {
  container.innerHTML = `
    <section class="admin-card">

      <h2>📦 Pedidos</h2>

      <p class="admin-subtitle">
        Gestioná los pedidos recibidos desde la vitrina.
      </p>

      <div class="admin-grid">

        <button class="admin-action-card" id="filterNew">
          <strong>Nuevos</strong>
          <span>0 pedidos</span>
        </button>

        <button class="admin-action-card" id="filterPreparing">
          <strong>Preparando</strong>
          <span>0 pedidos</span>
        </button>

        <button class="admin-action-card" id="filterReady">
          <strong>Listos</strong>
          <span>0 pedidos</span>
        </button>

        <button class="admin-action-card" id="filterDelivered">
          <strong>Entregados</strong>
          <span>0 pedidos</span>
        </button>

      </div>

      <div
        id="ordersContainer"
        style="margin-top:24px;"
      >
        ${renderEmptyState("Todavía no hay pedidos registrados.")}
      </div>

    </section>
  `;
}