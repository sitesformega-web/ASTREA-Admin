function renderBadge(text, type = "success") {
  return `
    <span class="badge ${type}">
      ${text}
    </span>
  `;
}