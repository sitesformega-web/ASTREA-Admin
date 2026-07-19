/* ==========================================================
   ASTREA™ Design System
   Admin Components

   Module Header
   ========================================================== */

function renderModuleHeader(options = {}) {

  const {

    title = "",

    subtitle = "",

    action = null

  } = options;

  return `

    <div class="admin-module-header">

      <div class="admin-module-info">

        <h2>${title}</h2>

        ${subtitle
          ? `<p>${subtitle}</p>`
          : ""
        }

      </div>

      ${action
        ? `
          <button
            id="${action.id}"
            class="ui-button primary"
            type="button"
          >
            ${action.label}
          </button>
        `
        : ""
      }

    </div>

  `;

}