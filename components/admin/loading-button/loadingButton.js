/* ==========================================================
   ASTREA™ Design System
   Admin Components

   Loading Button
   ========================================================== */

function setLoadingButton(button, text = "Procesando...") {

    if (!button) return;

    if (!button.dataset.originalText) {

        button.dataset.originalText = button.innerHTML;

    }

    button.disabled = true;

    button.classList.add("is-loading");

    button.innerHTML = text;

}

function clearLoadingButton(button) {

    if (!button) return;

    button.disabled = false;

    button.classList.remove("is-loading");

    if (button.dataset.originalText) {

        button.innerHTML = button.dataset.originalText;

    }

}
