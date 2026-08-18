/**
 * ============================================================
 * ASTREA™ Commerce
 * Customers Module
 * Application
 * ============================================================
 */

/**
 * Inicializa el módulo Customers.
 */
async function loadCustomers() {
  try {
    const customers = await adminFetchCustomers();

    setCustomers(customers);

    renderCustomersView();
  } catch (error) {
    console.error(error);

    showToast(
      "No se pudieron cargar los clientes.",
      "error"
    );
  }
}

/**
 * Renderiza el contenido principal del módulo
 * según el estado actual.
 */
function renderCustomersView() {
  const container =
    document.getElementById("customersView");

  if (!container) return;

  const customers = ADMIN_STATE.customers;

  container.innerHTML = customers.length
    ? renderCustomersList(customers)
    : renderCustomersEmptyState();

  bindCustomersEvents();
  bindCustomerRecordEvents();
}

/**
 * Eventos generales del módulo.
 */
function bindCustomersEvents() {
  document
    .querySelectorAll('[id^="btnEdit-"]')
    .forEach(button => {
      button.addEventListener("click", () => {
        const customerId =
          button.id.replace("btnEdit-", "");

        startEditingCustomer(customerId);
      });
    });

  document
    .querySelectorAll('[id^="btnSaveCustomer-"]')
    .forEach(button => {
      button.addEventListener("click", () => {
        const customerId =
          button.id.replace(
            "btnSaveCustomer-",
            ""
          );

        saveCustomer(customerId);
      });
    });

  document
    .querySelectorAll('[id^="btnCancelCustomer-"]')
    .forEach(button => {
      button.addEventListener("click", () => {
        cancelEditingCustomer();
      });
    });

  document
    .querySelectorAll('[id^="btnWhatsapp-"]')
    .forEach(button => {
      button.addEventListener("click", () => {
        const customerId =
          button.id.replace(
            "btnWhatsapp-",
            ""
          );

        openCustomerWhatsApp(customerId);
      });
    });

  document
    .querySelectorAll('[id^="btnHistory-"]')
    .forEach(button => {
      button.addEventListener("click", () => {
        showToast(
          "Historial de pedidos: próximamente.",
          "info"
        );
      });
    });
}

/**
 * Registra apertura y cierre de detalles.
 */
function bindCustomerRecordEvents() {
  const summaries =
    document.querySelectorAll(
      ".customer-record-summary"
    );

  summaries.forEach(summary => {
    summary.addEventListener(
      "click",
      handleCustomerRecordToggle
    );
  });
}

/**
 * Abre o cierra el detalle.
 */
function handleCustomerRecordToggle(event) {
  const summary = event.currentTarget;

  const card =
    summary.closest(".ui-card");

  if (!card) return;

  const expanded =
    card.querySelector(".ui-card-expanded");

  if (!expanded) return;

  expanded.classList.toggle("is-open");
}

/**
 * Inicia edición.
 */
function startEditingCustomer(customerId) {
  ADMIN_STATE.editingCustomerId =
    customerId;

  renderCustomersView();

  reopenCustomerCard(customerId);
}

/**
 * Cancela edición.
 */
function cancelEditingCustomer() {
  const customerId =
    ADMIN_STATE.editingCustomerId;

  ADMIN_STATE.editingCustomerId = null;

  renderCustomersView();

  if (customerId) {
    reopenCustomerCard(customerId);
  }
}

/**
 * Guarda cambios del cliente.
 */
async function saveCustomer(customerId) {
  const customer =
    ADMIN_STATE.customers.find(
      item => item.id === customerId
    );

  if (!customer) return;

  const nameInput =
    document.getElementById(
      `customer-name-${customerId}`
    );

  const phoneInput =
    document.getElementById(
      `customer-phone-${customerId}`
    );

  const notesInput =
    document.getElementById(
      `customer-notes-${customerId}`
    );

  const button =
    document.getElementById(
      `btnSaveCustomer-${customerId}`
    );

  if (
    !nameInput ||
    !phoneInput ||
    !notesInput
  ) {
    return;
  }

  const name =
    nameInput.value.trim();

  const phone =
    phoneInput.value.trim();

  const notes =
    notesInput.value.trim();

  if (!name) {
    showToast(
      "Ingresá el nombre del cliente.",
      "error"
    );

    return;
  }

  if (!phone) {
    showToast(
      "Ingresá el teléfono del cliente.",
      "error"
    );

    return;
  }

  setLoadingButton(
    button,
    "Guardando..."
  );

  try {
    const updatedCustomer = {
      ...customer,
      name,
      phone,
      notes
    };

    await adminUpdateCustomer(
      updatedCustomer
    );

    const index =
      ADMIN_STATE.customers.findIndex(
        item => item.id === customerId
      );

    if (index >= 0) {
      ADMIN_STATE.customers[index] =
        updatedCustomer;
    }

    ADMIN_STATE.editingCustomerId = null;

    showToast(
      "Cliente actualizado correctamente.",
      "success"
    );

    renderCustomersView();

    reopenCustomerCard(customerId);
  } catch (error) {
    console.error(error);

    showToast(
      "No se pudo actualizar el cliente.",
      "error"
    );
  } finally {
    clearLoadingButton(button);
  }
}

/**
 * Abre WhatsApp.
 */
function openCustomerWhatsApp(customerId) {
  const customer =
    ADMIN_STATE.customers.find(
      item => item.id === customerId
    );

  if (!customer || !customer.phone) {
    showToast(
      "El cliente no tiene teléfono.",
      "error"
    );

    return;
  }

  const phone = String(
    customer.phone
  ).replace(/\D/g, "");

  window.open(
    `https://wa.me/${phone}`,
    "_blank"
  );
}

/**
 * Reabre visualmente una card
 * después de un re-render.
 */
function reopenCustomerCard(customerId) {
  const summary =
    document.querySelector(
      `.customer-record-summary[data-customer-id="${customerId}"]`
    );

  if (!summary) return;

  const card =
    summary.closest(".ui-card");

  if (!card) return;

  const expanded =
    card.querySelector(".ui-card-expanded");

  if (!expanded) return;

  expanded.classList.add("is-open");
}
