const API_BASE = "TU_URL_EXEC";

async function apiGet(action) {
  const response = await fetch(`${API_BASE}?action=${action}`);
  return response.json();
}

async function apiPost(action, body) {
  const response = await fetch(`${API_BASE}?action=${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return response.json();
}

async function getOrders() {
  return apiGet("orders");
}

async function updateOrderStatus(orderId, status) {
  return apiPost("updateOrderStatus", {
    orderId,
    status
  });
}

async function getProducts() {
  return apiGet("products");
}

async function getReports() {
  return apiGet("reports");
}
