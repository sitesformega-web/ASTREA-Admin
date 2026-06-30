const ORDER_STATUSES = [
  { id: "pending", label: "Nuevos", type: "success" },
  { id: "preparing", label: "Preparando", type: "warning" },
  { id: "ready", label: "Listos", type: "info" },
  { id: "delivered", label: "Entregados", type: "neutral" },
  { id: "cancelled", label: "Cancelados", type: "danger" }
];

function renderOrdersModule(container) {
  container.innerHTML = `
    <section class="orders-module">
      <div class="orders-header">
        <h2>📦 Pedidos</h2>
        <p>Gestioná los pedidos recibidos desde la vitrina.</p>
      </div>

      <div id="ordersView">
        ${renderEmptyState("Cargando pedidos...")}
      </div>
    </section>
  `;
}

function renderOrdersView() {
  const container = document.getElementById("ordersView");

  if (!container) return;

  const orders = getFilteredOrders();

  container.innerHTML = `
    ${renderOrderFilters()}

    <div class="orders-list">
      ${
        orders.length
          ? orders.map(order => renderOrderCard(order)).join("")
          : renderEmptyState("No hay pedidos en este estado.")
      }
    </div>
  `;

  bindOrdersEvents();
}

function getFilteredOrders() {
  return ADMIN_STATE.orders.filter(order => {
    return order.estado === ADMIN_STATE.ordersFilter;
  });
}

function renderOrderFilters() {
  return `
    <div class="order-filters">
      ${ORDER_STATUSES.map(status => {
        const count = ADMIN_STATE.orders.filter(
          order => order.estado === status.id
        ).length;

        return `
          <button
            class="order-filter ${ADMIN_STATE.ordersFilter === status.id ? "active" : ""}"
            type="button"
            data-status="${status.id}"
          >
            ${status.label}
            <span>${count}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderOrderCard(order) {
  const expanded = ADMIN_STATE.expandedOrderId === order.id;
  const status = ORDER_STATUSES.find(item => item.id === order.estado);
  const next = getNextOrderStatus(order.estado);

  return `
    <article class="order-card ${order.estado === "pending" ? "is-new" : ""}">
      <button class="order-card-main" type="button" data-order-expand="${order.id}">
        <div>
          <strong>${order.cliente || "Cliente"}</strong>
          <span>${order.id}</span>
        </div>

        <div class="order-meta">
          <span>${timeAgo(order.fecha)}</span>
          <span>${formatAdminMoney(order.total)}</span>
        </div>

        <div class="order-status-line">
          <span class="order-dot ${status?.type || "neutral"}"></span>
          <span>${status?.label || order.estado}</span>
        </div>
      </button>

      ${
        expanded
          ? `
            <div class="order-detail">
              <div class="order-detail-block">
                <h3>Productos</h3>
                ${renderOrderItems(order.items || [])}
              </div>

              <div class="order-detail-block">
                <h3>Cliente</h3>
                <p>${order.cliente || "-"}</p>
                <p>${order.telefono || "-"}</p>
              </div>

              ${
                order.observacion
                  ? `
                    <div class="order-detail-block">
                      <h3>Observación</h3>
                      <p>${order.observacion}</p>
                    </div>
                  `
                  : ""
              }

              <div class="order-total">
                <span>Total estimado</span>
                <strong>${formatAdminMoney(order.total)}</strong>
              </div>

              <div class="order-actions">
                ${
                  next
                    ? `
                      <button 
                        class="ui-button primary"
                        type="button"
                        data-order-status="${order.id}"
                        data-next-status="${next.status}"
                      >
                        ${next.label}
                      </button>
                    `
                    : ""
                }

                <button 
                  class="ui-button secondary"
                  type="button"
                  data-order-contact="${order.telefono || ""}"
                >
                  Contactar al cliente
                </button>

                ${
                  order.estado !== "cancelled" && order.estado !== "delivered"
                    ? `
                      <button 
                        class="ui-button danger"
                        type="button"
                        data-order-status="${order.id}"
                        data-next-status="cancelled"
                      >
                        Cancelar pedido
                      </button>
                    `
                    : ""
                }
              </div>
            </div>
          `
          : ""
      }
    </article>
  `;
}

function renderOrderItems(items) {
  if (!items.length) {
    return `<p>No hay productos registrados.</p>`;
  }

  return `
    <div class="order-items">
      ${items.map(item => `
        <div class="order-item">
          <span>${item.nombre}</span>
          <strong>${getOrderItemQuantity(item)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function getOrderItemQuantity(item) {
  if (item.tipoVenta === "weight") {
    return `${item.gramos} g`;
  }

  return `${item.cantidad} unidad(es)`;
}

function bindOrdersEvents() {
  document.querySelectorAll("[data-status]").forEach(button => {
    button.addEventListener("click", () => {
      handleOrderFilter(button.dataset.status);
    });
  });

  document.querySelectorAll("[data-order-expand]").forEach(button => {
    button.addEventListener("click", () => {
      handleOrderExpand(button.dataset.orderExpand);
    });
  });

  document.querySelectorAll("[data-order-status]").forEach(button => {
    button.addEventListener("click", () => {
      handleOrderStatusChange(
        button.dataset.orderStatus,
        button.dataset.nextStatus
      );
    });
  });

  document.querySelectorAll("[data-order-contact]").forEach(button => {
    button.addEventListener("click", () => {
      contactCustomer(button.dataset.orderContact);
    });
  });
}

function formatAdminMoney(value) {
  return "Gs. " + Number(value || 0).toLocaleString();
}

function timeAgo(value) {
  const date = new Date(value);
  const now = new Date();
  const diff = Math.floor((now - date) / 60000);

  if (Number.isNaN(diff)) return "Fecha no disponible";

  if (diff < 1) return "Recién";
  if (diff < 60) return `Hace ${diff} min`;

  const hours = Math.floor(diff / 60);

  if (hours < 24) return `Hace ${hours} h`;

  const days = Math.floor(hours / 24);
  return `Hace ${days} día(s)`;
}
