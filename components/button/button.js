/**
 * ============================================================
 * ASTREA™ Commerce
 * Design System
 * Button
 * ============================================================
 */

/**
 * Renderiza un botón.
 *
 * Compatible con:
 *
 * renderButton("Guardar");
 *
 * renderButton("Guardar", {
 *   id: "btnSave",
 *   variant: "primary"
 * });
 *
 * renderButton({
 *   label: "Guardar",
 *   id: "btnSave",
 *   variant: "primary"
 * });
 */
function renderButton(config, options = {}) {

    // Compatibilidad con la API anterior

    if (typeof config === "string") {

        config = {
            label: config,
            ...options
        };

    }

    const {

        label = "",

        id = "",

        variant = config.type || "primary",

        disabled = false,

        type = "button"

    } = config;

    return `
        <button
            ${id ? `id="${id}"` : ""}
            class="ui-button ${variant}"
            type="${type}"
            ${disabled ? "disabled" : ""}
        >
            ${label}
        </button>
    `;

}
