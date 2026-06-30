function renderButton(label, options = {}) {
  const type = options.type || "primary";
  const id = options.id ? `id="${options.id}"` : "";
  const disabled = options.disabled ? "disabled" : "";

  return `
    <button ${id} class="ui-button ${type}" type="button" ${disabled}>
      ${label}
    </button>
  `;
}