/* ==========================================================
   ASTREA™ Design System
   Admin Components

   Loading Button
   ========================================================== */

function setLoadingButton(button, label = "Procesando...") {

    if (!button) return;

    button.dataset.originalLabel = button.innerHTML;

    button.disabled = true;

    button.innerHTML = label;

}

function clearLoadingButton(button) {

    if (!button) return;

    button.disabled = false;

    button.innerHTML = button.dataset.originalLabel || "";

}