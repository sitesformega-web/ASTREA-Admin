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

  expandedProductId: null,
  creatingProduct: false,

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

function setProducts(products) {
  ADMIN_STATE.products = Array.isArray(products) ? products : [];
}

function setExpandedProduct(productId) {
  ADMIN_STATE.expandedProductId =
    ADMIN_STATE.expandedProductId === productId ? null : productId;
}

function setCreatingProduct(value) {
  ADMIN_STATE.creatingProduct = Boolean(value);
}
