/* ==========================================================
   ASTREA™ Design System
   Admin Components

   Confirm Dialog
   ========================================================== */

function confirmDialog({

    title = "Confirmar acción",

    message = "",

    confirmText = "Aceptar",

    cancelText = "Cancelar",

    confirmStyle = "primary",

    onConfirm = () => {}

} = {}) {

    closeConfirmDialog();

    const overlay =
        document.createElement("div");

    overlay.className =
        "admin-confirm-overlay";

    overlay.innerHTML = `

        <div
            class="admin-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmDialogTitle">

            <div class="admin-confirm-header">

                <h3 id="confirmDialogTitle">

                    ${title}

                </h3>

            </div>

            <div class="admin-confirm-body">

                <p>

                    ${message.replace(/\n/g, "<br>")}

                </p>

            </div>

            <div class="admin-confirm-footer">

                <button
                    type="button"
                    class="ui-button secondary"
                    id="confirmCancel">

                    ${cancelText}

                </button>

                <button
                    type="button"
                    class="ui-button ${confirmStyle}"
                    id="confirmAccept">

                    ${confirmText}

                </button>

            </div>

        </div>

    `;

    document.body.appendChild(overlay);

    const cancelButton =
        overlay.querySelector("#confirmCancel");

    const confirmButton =
        overlay.querySelector("#confirmAccept");

    cancelButton.addEventListener(
        "click",
        closeConfirmDialog
    );

    confirmButton.addEventListener(
        "click",
        async () => {

            closeConfirmDialog();

            await onConfirm();

        }
    );

    overlay.addEventListener(
        "click",
        event => {

            if (event.target === overlay) {

                closeConfirmDialog();

            }

        }
    );

    document.addEventListener(
        "keydown",
        handleConfirmDialogKeydown
    );

    confirmButton.focus();

}

function closeConfirmDialog() {

    document
        .querySelectorAll(".admin-confirm-overlay")
        .forEach(dialog => dialog.remove());

    document.removeEventListener(
        "keydown",
        handleConfirmDialogKeydown
    );

}

function handleConfirmDialogKeydown(event) {

    if (event.key === "Escape") {

        closeConfirmDialog();

    }

}
