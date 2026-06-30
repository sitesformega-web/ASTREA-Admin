async function loadOrders() {
  try {
    const orders = await adminFetchOrders();
    setOrders(orders);
    renderOrdersView();
  } catch (error) {
    console.error(error);
    showToast("No se pudieron cargar los pedidos.", "error");
  }
}

async function handleOrderStatusChange(orderId, status) {
  try {
    await adminUpdateOrderStatus(orderId, status);

    ADMIN_STATE.orders = ADMIN_STATE.orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          estado: status
        };
      }

      return order;
    });

    showToast("Estado actualizado.", "success");
    renderOrdersView();
  } catch (error) {
    console.error(error);
    showToast("No se pudo actualizar el pedido.", "error");
  }
}

function handleOrderFilter(status) {
  setOrdersFilter(status);
  ADMIN_STATE.expandedOrderId = null;
  renderOrdersView();
}

function handleOrderExpand(orderId) {
  setExpandedOrder(orderId);
  renderOrdersView();
}

function getNextOrderStatus(status) {
  const map = {
    pending: {
      label: "Comenzar preparación",
      status: "preparing"
    },
    preparing: {
      label: "Marcar listo",
      status: "ready"
    },
    ready: {
      label: "Marcar entregado",
      status: "delivered"
    }
  };

  return map[status] || null;
}

function contactCustomer(phone) {
  if (!phone) {
    showToast("El pedido no tiene teléfono.", "error");
    return;
  }

  window.open(`https://wa.me/${phone}`, "_blank");
}
