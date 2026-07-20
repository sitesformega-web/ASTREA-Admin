/* ==========================================================
   ASTREA™ Design System
   Admin Components

   Form Field
   ========================================================== */

function renderFormField(options = {}) {

  const {

    label = "",

    control = "",

    hint = "",

    error = ""

  } = options;

  return `

    <div class="admin-form-field">

      ${label
        ? `<label class="admin-form-label">${label}</label>`
        : ""
      }

      ${control}

      ${hint
        ? `<small class="admin-form-hint">${hint}</small>`
        : ""
      }

      <small class="admin-form-error">

        ${error}

      </small>

    </div>

  `;

}