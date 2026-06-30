const ADMIN_STATE = {
  currentModule: "orders",

  user: {
    name: "Admin ASTREA",
    email: "",
    role: ADMIN_CONFIG.role
  },

  orders: [],
  products: [],
  customers: [],

  ordersFilter: "pending",
  expandedOrderId: null,

  loading: false
};

function setOrders(orders) {
  ADMIN_STATE.orders = Array.isArray(orders) ? orders : [];
}

function setOrdersFilter(status) {
  ADMIN_STATE.ordersFilter = status;
}

function setExpandedOrder(orderId) {
  ADMIN_STATE.expandedOrderId =
    ADMIN_STATE.expandedOrderId === orderId ? null : orderId;
}
