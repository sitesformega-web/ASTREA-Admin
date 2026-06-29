function showToast(message, type = "info") {
  const root = document.getElementById("toast-root");

  root.innerHTML = `
    <div class="toast ${type}">
      ${message}
    </div>
  `;

  setTimeout(() => {
    root.innerHTML = "";
  }, 3000);
}