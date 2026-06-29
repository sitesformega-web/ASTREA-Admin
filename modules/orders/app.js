async function loadOrders() {
  try {
    ADMIN_STATE.orders = await adminFetchOrders();

    renderAdminApp();

  } catch (error) {
    console.error(error);

    showToast(
      "No se pudieron cargar los pedidos.",
      "error"
    );
  }
}