function renderChip(label, options = {}) {
  const active = options.active ? "active" : "";
  const id = options.id ? `id="${options.id}"` : "";
  const data = options.data ? options.data : "";

  return `
    <button ${id} class="ui-chip ${active}" type="button" ${data}>
      ${label}
    </button>
  `;
}