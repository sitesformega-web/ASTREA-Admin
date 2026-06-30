function renderAccordion(title, body, options = {}) {
  const id = options.id || "";

  return `
    <section class="ui-accordion" ${id ? `id="${id}"` : ""}>
      <button class="ui-accordion-head" type="button">
        <span>${title}</span>
        <span>⌄</span>
      </button>
      <div class="ui-accordion-body">
        ${body}
      </div>
    </section>
  `;
}