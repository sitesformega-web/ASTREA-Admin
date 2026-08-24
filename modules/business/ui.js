/* ==========================================================================
   ASTREA™ Admin
   Business Module UI
   ========================================================================== */


/* ==========================================================================
   Module render
   ========================================================================== */

async function renderBusinessModule(container) {
  renderBusinessLoading(container);

  try {
    await loadBusiness();
    renderBusinessContent(container);
  } catch (error) {
    renderBusinessError(
      container,
      error.message ||
        "No se pudo cargar la información del negocio."
    );
  }
}


/* ==========================================================================
   Loading / Error
   ========================================================================== */

function renderBusinessLoading(container) {
  container.innerHTML = `
    <section class="business-module">
      <header class="business-header">
        <h2>🏪 Negocio</h2>
        <p>Cargando información...</p>
      </header>
    </section>
  `;
}


function renderBusinessError(container, message) {
  container.innerHTML = `
    <section class="business-module">
      <header class="business-header">
        <h2>🏪 Negocio</h2>
        <p>
          ${escapeBusinessHtml(message)}
        </p>
      </header>

      <button
        type="button"
        data-business-retry
      >
        Reintentar
      </button>
    </section>
  `;

  const retryButton =
    container.querySelector(
      "[data-business-retry]"
    );

  if (retryButton) {
    retryButton.addEventListener(
      "click",
      () => renderBusinessModule(container)
    );
  }
}


/* ==========================================================================
   Main content
   ========================================================================== */

function renderBusinessContent(container) {
  const business = ADMIN_STATE.business;

  if (!business) {
    renderBusinessError(
      container,
      "No se encontró información del negocio."
    );

    return;
  }

  container.innerHTML = `
    <section class="business-module">
      <header class="business-header">
        <h2>🏪 Negocio</h2>

        <p>
          Administrá la información de tu comercio.
        </p>
      </header>

      <div class="business-layout">
        <div class="business-column">
          ${renderBusinessInfoSection(
            business.info || {}
          )}

          ${renderBusinessContactSection(
            business.contact || {}
          )}
        </div>

        <div class="business-column">
          ${renderBusinessScheduleSection(
            business.schedule || {}
          )}
        </div>
      </div>
    </section>
  `;

  bindBusinessFormEvents(container);
  syncBusinessScheduleInputs(container);
}


/* ==========================================================================
   Information
   ========================================================================== */

function renderBusinessInfoSection(info) {
  return `
    <section class="business-section">
      <div class="business-section-header">
        <h3>Información del negocio</h3>

        <p>
          Datos principales con los que se identifica tu comercio.
        </p>
      </div>

      <form data-business-form="info">
        <div class="business-field">
          <label for="business-name">
            Nombre
          </label>

          <input
            id="business-name"
            type="text"
            name="name"
            value="${escapeBusinessHtml(
              info.name || ""
            )}"
            required
          >
        </div>

        <div class="business-field">
          <label for="business-description">
            Descripción
          </label>

          <textarea
            id="business-description"
            name="description"
            rows="4"
          >${escapeBusinessHtml(
            info.description || ""
          )}</textarea>
        </div>

        <div class="business-form-actions">
          <button
            type="submit"
            data-business-save
          >
            Guardar cambios
          </button>
        </div>

        <p
          class="business-form-status"
          data-business-status
          aria-live="polite"
        ></p>
      </form>
    </section>
  `;
}


/* ==========================================================================
   Contact
   ========================================================================== */

function renderBusinessContactSection(contact) {
  return `
    <section class="business-section">
      <div class="business-section-header">
        <h3>Contacto</h3>

        <p>
          Datos que tus clientes pueden utilizar para comunicarse contigo.
        </p>
      </div>

      <form data-business-form="contact">
        <div class="business-field">
          <label for="business-phone">
            Teléfono
          </label>

          <input
            id="business-phone"
            type="tel"
            name="phone"
            value="${escapeBusinessHtml(
              contact.phone || ""
            )}"
          >
        </div>

        <div class="business-field">
          <label for="business-whatsapp">
            WhatsApp
          </label>

          <input
            id="business-whatsapp"
            type="tel"
            name="whatsapp"
            value="${escapeBusinessHtml(
              contact.whatsapp || ""
            )}"
          >
        </div>

        <div class="business-field">
          <label for="business-address">
            Dirección / referencia
          </label>

          <textarea
            id="business-address"
            name="address"
            rows="3"
          >${escapeBusinessHtml(
            contact.address || ""
          )}</textarea>
        </div>

        <div class="business-form-actions">
          <button
            type="submit"
            data-business-save
          >
            Guardar cambios
          </button>
        </div>

        <p
          class="business-form-status"
          data-business-status
          aria-live="polite"
        ></p>
      </form>
    </section>
  `;
}


/* ==========================================================================
   Schedule
   ========================================================================== */

function renderBusinessScheduleSection(schedule) {
  return `
    <section class="business-section business-section--schedule">
      <div class="business-section-header">
        <h3>Horarios</h3>

        <p>
          Configurá los días y horarios habituales de atención.
        </p>
      </div>

      <form data-business-form="schedule">
        <div class="business-schedule">
          ${getBusinessDays()
            .map(day =>
              renderBusinessScheduleDay(
                day,
                schedule[day.key]
              )
            )
            .join("")}
        </div>

        <div class="business-form-actions">
          <button
            type="submit"
            data-business-save
          >
            Guardar horarios
          </button>
        </div>

        <p
          class="business-form-status"
          data-business-status
          aria-live="polite"
        ></p>
      </form>
    </section>
  `;
}


function renderBusinessScheduleDay(
  day,
  value
) {
  const dayValue = value || {
    enabled: false,
    open: "",
    close: ""
  };

  const enabled =
    dayValue.enabled === true;

  return `
    <div
      class="business-schedule-day"
      data-business-day="${day.key}"
    >
      <div class="business-schedule-day-header">
        <strong>
          ${day.label}
        </strong>

        <label class="business-schedule-toggle">
          <input
            type="checkbox"
            data-business-day-enabled
            ${enabled ? "checked" : ""}
          >

          <span>
            ${enabled ? "Abierto" : "Cerrado"}
          </span>
        </label>
      </div>

      <div class="business-schedule-hours">
        <div class="business-field">
          <label>
            Apertura
          </label>

          <input
            type="time"
            data-business-day-open
            value="${escapeBusinessHtml(
              dayValue.open || ""
            )}"
            ${enabled ? "" : "disabled"}
          >
        </div>

        <div class="business-field">
          <label>
            Cierre
          </label>

          <input
            type="time"
            data-business-day-close
            value="${escapeBusinessHtml(
              dayValue.close || ""
            )}"
            ${enabled ? "" : "disabled"}
          >
        </div>
      </div>
    </div>
  `;
}


/* ==========================================================================
   Forms
   ========================================================================== */

function bindBusinessFormEvents(container) {
  const forms =
    container.querySelectorAll(
      "[data-business-form]"
    );

  forms.forEach(form => {
    form.addEventListener(
      "submit",
      async event => {
        event.preventDefault();

        await handleBusinessFormSubmit(
          form,
          container
        );
      }
    );
  });
}


async function handleBusinessFormSubmit(
  form,
  container
) {
  const section =
    form.dataset.businessForm;

  const status =
    form.querySelector(
      "[data-business-status]"
    );

  const saveButton =
    form.querySelector(
      "[data-business-save]"
    );

  const defaultButtonText =
    section === "schedule"
      ? "Guardar horarios"
      : "Guardar cambios";

  try {
    const data =
      getBusinessFormData(
        form,
        section
      );

    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent =
        "Guardando...";
    }

    if (status) {
      status.textContent = "";
    }

    const result =
      await saveBusinessSection(
        section,
        data
      );

    renderBusinessContent(container);

    const refreshedForm =
      container.querySelector(
        `[data-business-form="${section}"]`
      );

    const refreshedStatus =
      refreshedForm
        ? refreshedForm.querySelector(
            "[data-business-status]"
          )
        : null;

    if (refreshedStatus) {
      refreshedStatus.textContent =
        result.message ||
        "Cambios guardados.";
    }

  } catch (error) {
    if (status) {
      status.textContent =
        error.message ||
        "No se pudieron guardar los cambios.";
    }

    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent =
        defaultButtonText;
    }
  }
}


/* ==========================================================================
   Form data
   ========================================================================== */

function getBusinessFormData(
  form,
  section
) {
  if (section === "info") {
    const formData =
      new FormData(form);

    return {
      name:
        String(
          formData.get("name") || ""
        ).trim(),

      description:
        String(
          formData.get(
            "description"
          ) || ""
        ).trim()
    };
  }

  if (section === "contact") {
    const formData =
      new FormData(form);

    return {
      phone:
        String(
          formData.get("phone") || ""
        ).trim(),

      whatsapp:
        String(
          formData.get(
            "whatsapp"
          ) || ""
        ).trim(),

      address:
        String(
          formData.get("address") || ""
        ).trim()
    };
  }

  if (section === "schedule") {
    return getBusinessScheduleFormData(
      form
    );
  }

  throw new Error(
    "Sección de Business no válida."
  );
}


function getBusinessScheduleFormData(form) {
  const schedule = {};

  const days =
    form.querySelectorAll(
      "[data-business-day]"
    );

  days.forEach(dayElement => {
    const day =
      dayElement.dataset.businessDay;

    const enabledInput =
      dayElement.querySelector(
        "[data-business-day-enabled]"
      );

    const openInput =
      dayElement.querySelector(
        "[data-business-day-open]"
      );

    const closeInput =
      dayElement.querySelector(
        "[data-business-day-close]"
      );

    const enabled =
      Boolean(
        enabledInput &&
        enabledInput.checked
      );

    schedule[day] = {
      enabled,

      open:
        enabled && openInput
          ? openInput.value
          : "",

      close:
        enabled && closeInput
          ? closeInput.value
          : ""
    };
  });

  return schedule;
}


/* ==========================================================================
   Schedule interaction
   ========================================================================== */

function syncBusinessScheduleInputs(
  container
) {
  const days =
    container.querySelectorAll(
      "[data-business-day]"
    );

  days.forEach(dayElement => {
    const enabledInput =
      dayElement.querySelector(
        "[data-business-day-enabled]"
      );

    if (!enabledInput) {
      return;
    }

    enabledInput.addEventListener(
      "change",
      () => {
        updateBusinessScheduleDayState(
          dayElement
        );
      }
    );
  });
}


function updateBusinessScheduleDayState(
  dayElement
) {
  const enabledInput =
    dayElement.querySelector(
      "[data-business-day-enabled]"
    );

  const openInput =
    dayElement.querySelector(
      "[data-business-day-open]"
    );

  const closeInput =
    dayElement.querySelector(
      "[data-business-day-close]"
    );

  const statusText =
    enabledInput
      ? enabledInput.parentElement.querySelector(
          "span"
        )
      : null;

  const enabled =
    Boolean(
      enabledInput &&
      enabledInput.checked
    );

  if (openInput) {
    openInput.disabled = !enabled;
  }

  if (closeInput) {
    closeInput.disabled = !enabled;
  }

  if (statusText) {
    statusText.textContent =
      enabled
        ? "Abierto"
        : "Cerrado";
  }
}


/* ==========================================================================
   Helpers
   ========================================================================== */

function getBusinessDays() {
  return [
    {
      key: "monday",
      label: "Lunes"
    },
    {
      key: "tuesday",
      label: "Martes"
    },
    {
      key: "wednesday",
      label: "Miércoles"
    },
    {
      key: "thursday",
      label: "Jueves"
    },
    {
      key: "friday",
      label: "Viernes"
    },
    {
      key: "saturday",
      label: "Sábado"
    },
    {
      key: "sunday",
      label: "Domingo"
    }
  ];
}


function escapeBusinessHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
