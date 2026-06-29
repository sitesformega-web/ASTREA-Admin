async function adminApiRequest(action, options = {}) {
  const url = `${ADMIN_CONFIG.api.endpoint}?action=${action}`;

  const response = await fetch(url, {
    method: options.method || "GET",
    cache: "no-store",
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Error en ASTREA Admin.");
  }

  return data;
}

async function adminFetchProducts() {
  const data = await adminApiRequest("products");
  return data.products || [];
}

async function adminFetchOrders() {
  const data = await adminApiRequest("orders");
  return data.orders || [];
}