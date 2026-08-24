/* ==========================================================================
   ASTREA™ Admin
   Business Module UI
   ========================================================================== */

let expandedBusinessSection = null;


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
      error.message || "No se pudo cargar la información del negocio."
    );
  }
}


/* ==========================================================================
   Loading / Error
   ========================================================================== */

function renderBusinessLoading(container) {
  container.innerHTML = `
    <section class="admin-card">
      <h2>🏪 Mi negocio</h2>
      <p>Cargando información...</p>
    </section>
  `;
}


function renderBusinessError(container, message) {
  container.innerHTML = `
    <section class="admin-card">
      <h2>🏪 Mi negocio</h2>

      <p>
        ${escapeBusinessHtml(message)}
      </p>

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
    <section class="admin-card business-module">
      <header class="business-header">
        <h2>🏪 Mi negocio</h2>

        <p>
          Administrá la información de tu comercio.
        </p>
      </header>

      <div class="business-sections">
        ${renderBusinessInfoSection(business)}

        ${renderBusinessContactSection(business)}

        ${renderBusinessScheduleSection(business)}
      </div>
    </section>
  `;

  bindBusinessSectionEvents(container);
  bindBusinessFormEvents(container);
  syncBusinessScheduleInputs(container);
}


/* ==========================================================================
   Information section
   ========================================================================== */

function renderBusinessInfoSection(business) {
  const info = business.info || {};

  const isExpanded =
    expandedBusinessSection === "info";

  const summary =
    info.name || "Sin nombre configurado";

  return `
    <section
      class="business-section ${
        isExpanded
          ? "business-section--expanded"
          : ""
      }"
    >
      <button
        type="button"
        class="business-section-summary"
        data-business-section="info"
        aria-expanded="${isExpanded}"
      >
        <span>
          <strong>
            Información del negocio
          </strong>

          <small>
            ${escapeBusinessHtml(summary)}
          </small>
        </span>

        <span aria-hidden="true">
          ${isExpanded ? "−" : "+"}
        </span>
      </button>

      ${
        isExpanded
          ? renderBusinessInfoForm(info)
          : ""
      }
    </section>
  `;
}


function renderBusinessInfoForm(info) {
  return `
    <div class="business-section-detail">
      <form data-business-form="info">
        <label>
          <span>Nombre</span>

          <input
            type="text"
            name="name"
            value="${escapeBusinessHtml(
              info.name || ""
            )}"
            required
          >
        </label>

        <label>
          <span>Descripción</span>

          <textarea
            name="description"
            rows="4"
          >${escapeBusinessHtml(
            info.description || ""
          )}</textarea>
        </label>

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
    </div>
  `;
}


/* ==========================================================================
   Contact section
   ========================================================================== */

function renderBusinessContactSection(business) {
  const contact =
    business.contact || {};

  const isExpanded =
    expandedBusinessSection === "contact";

  const summary =
    contact.whatsapp ||
    contact.phone ||
    contact.address ||
    "Sin datos de contacto";

  return `
    <section
      class="business-section ${
        isExpanded
          ? "business-section--expanded"
          : ""
      }"
    >
      <button
        type="button"
        class="business-section-summary"
        data-business-section="contact"
        aria-expanded="${isExpanded}"
      >
        <span>
          <strong>Contacto</strong>

          <small>
            ${escapeBusinessHtml(summary)}
          </small>
        </span>

        <span aria-hidden="true">
          ${isExpanded ? "−" : "+"}
        </span>
      </button>

      ${
        isExpanded
          ? renderBusinessContactForm(
              contact
            )
          : ""
      }
    </section>
  `;
}


function renderBusinessContactForm(contact) {
  return `
    <div class="business-section-detail">
      <form data-business-form="contact">
        <label>
          <span>Teléfono</span>

          <input
            type="tel"
            name="phone"
            value="${escapeBusinessHtml(
              contact.phone || ""
            )}"
          >
        </label>

        <label>
          <span>WhatsApp</span>

          <input
            type="tel"
            name="whatsapp"
            value="${escapeBusinessHtml(
              contact.whatsapp || ""
            )}"
          >
        </label>

        <label>
          <span>Dirección / referencia</span>

          <textarea
            name="address"
            rows="3"
          >${escapeBusinessHtml(
            contact.address || ""
          )}</textarea>
        </label>

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
    </div>
  `;
}


/* ==========================================================================
   Schedule section
   ========================================================================== */

function renderBusinessScheduleSection(
  business
) {
  const schedule =
    business.schedule || {};

  const isExpanded =
    expandedBusinessSection === "schedule";

  const summary =
    getBusinessScheduleSummary(schedule);

  return `
    <section
      class="business-section ${
        isExpanded
          ? "business-section--expanded"
          : ""
      }"
    >
      <button
        type="button"
        class="business-section-summary"
        data-business-section="schedule"
        aria-expanded="${isExpanded}"
      >
        <span>
          <strong>Horarios</strong>

          <small>
            ${escapeBusinessHtml(summary)}
          </small>
        </span>

        <span aria-hidden="true">
          ${isExpanded ? "−" : "+"}
        </span>
      </button>

      ${
        isExpanded
          ? renderBusinessScheduleForm(
              schedule
            )
          : ""
      }
    </section>
  `;
}


function renderBusinessScheduleForm(
  schedule
) {
  const days = getBusinessDays();

  return `
    <div class="business-section-detail">
      <form data-business-form="schedule">
        <div class="business-schedule">
          ${days
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
    </div>
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

        <label>
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
        <label>
          <span>Apertura</span>

          <input
            type="time"
            data-business-day-open
            value="${escapeBusinessHtml(
              dayValue.open || ""
            )}"
            ${enabled ? "" : "disabled"}
          >
        </label>

        <label>
          <span>Cierre</span>

          <input
            type="time"
            data-business-day-close
            value="${escapeBusinessHtml(
              dayValue.close || ""
            )}"
            ${enabled ? "" : "disabled"}
          >
        </label>
      </div>
    </div>
  `;
}


/* ==========================================================================
   Section interaction
   ========================================================================== */

function bindBusinessSectionEvents(container) {
  const sectionButtons =
    container.querySelectorAll(
      "[data-business-section]"
    );

  sectionButtons.forEach(button => {
    button.addEventListener(
      "click",
      () => {
        const section =
          button.dataset.businessSection;

        expandedBusinessSection =
          expandedBusinessSection === section
            ? null
            : section;

        renderBusinessContent(container);
      }
    );
  });
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
        section === "schedule"
          ? "Guardar horarios"
          : "Guardar cambios";
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


function getBusinessScheduleSummary(
  schedule
) {
  const days =
    getBusinessDays();

  const enabledDays =
    days.filter(day =>
      schedule[day.key] &&
      schedule[day.key].enabled === true
    );

  if (enabledDays.length === 0) {
    return "Sin horarios configurados";
  }

  if (enabledDays.length === 1) {
    return "1 día configurado";
  }

  return `${enabledDays.length} días configurados`;
}


function escapeBusinessHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
