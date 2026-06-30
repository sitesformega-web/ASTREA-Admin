function renderCard(content, options = {}) {
  const compact = options.compact ? "compact" : "";

  return `
    <section class="ui-card ${compact}">
      ${content}
    </section>
  `;
}