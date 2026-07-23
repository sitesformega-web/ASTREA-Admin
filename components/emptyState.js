/**
 * ============================================================
 * ASTREA™ Commerce
 * Design System
 * Empty State
 * ============================================================
 */

/**
 * Renderiza un estado vacío.
 *
 * Compatible con:
 *
 * renderEmptyState("Mensaje");
 *
 * y
 *
 * renderEmptyState({
 *   title,
 *   description,
 *   buttonLabel,
 *   buttonId
 * });
 */
function renderEmptyState(config) {

    // Compatibilidad con versiones anteriores

    if (typeof config === "string") {

        return `
            <div class="empty-state">
                <p class="empty-state-message">
                    ${config}
                </p>
            </div>
        `;

    }

    // Nueva versión enriquecida

    const {

        title = "",
        description = "",
        buttonLabel = "",
        buttonId = ""

    } = config;

    return `
    <div class="empty-state">

        ${title ? `
            <h3 class="empty-state-title">
                ${title}
            </h3>
        ` : ""}

        ${description ? `
            <p class="empty-state-description">
                ${description}
            </p>
        ` : ""}

        ${
            buttonLabel
                ? renderButton({
                    label: buttonLabel,
                    id: buttonId,
                    variant: "primary"
                })
                : ""
        }

        </div>
    `;

}
