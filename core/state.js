const STATE = {

  orders: [],

  selectedOrder: null,

  filters: {

    status: "pending"

  },

  loading: false

};

function setOrders(orders) {
  STATE.orders = orders;
}

function getOrdersByStatus(status) {

  if (status === "all") {
    return STATE.orders;
  }

  return STATE.orders.filter(order => order.estado === status);

}

function setSelectedOrder(orderId) {

  STATE.selectedOrder = orderId;

}

function getSelectedOrder() {

  return STATE.orders.find(order => order.id === STATE.selectedOrder);

}

function setFilter(status) {

  STATE.filters.status = status;

}
