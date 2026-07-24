/**
 * ============================================================
 * ASTREA™ Commerce
 * Card Component
 * ============================================================
 */

/**
 * Renderiza una Card del Design System.
 *
 * API Legacy:
 * renderCard(content)
 *
 * Nueva API:
 * renderCard({
 *   header,
 *   body,
 *   footer,
 *   expanded,
 *   compact
 * })
 *
 * @param {string|Object} content
 * @param {Object} options
 * @returns {string}
 */
function renderCard(content, options = {}) {

  // ----------------------------------------------------------
  // Compatibilidad con la API anterior
  // ----------------------------------------------------------

  if (typeof content === "string") {
    const compact = options.compact ? "compact" : "";

    return `
      <section class="ui-card ${compact}">
        ${content}
      </section>
    `;
  }

  // ----------------------------------------------------------
  // Nueva API
  // ----------------------------------------------------------

  const {
    header = "",
    body = "",
    footer = "",
    expanded = "",
    compact = false
  } = content;

  return `
    <section class="ui-card ${compact ? "compact" : ""}">

      ${header
        ? `
          <div class="ui-card-header">
            ${header}
          </div>
        `
        : ""}

      ${body
        ? `
          <div class="ui-card-body">
            ${body}
          </div>
        `
        : ""}

      ${footer
        ? `
          <div class="ui-card-footer">
            ${footer}
          </div>
        `
        : ""}

      ${expanded
        ? `
          <div class="ui-card-expanded">
            ${expanded}
          </div>
        `
        : ""}

    </section>
  `;
}
