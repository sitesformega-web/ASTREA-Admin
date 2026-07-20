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

    const overlay = document.createElement("div");

    overlay.className = "admin-confirm-overlay";

    overlay.innerHTML = `

        <div class="admin-confirm-dialog">

            <div class="admin-confirm-header">

                <h3>${title}</h3>

            </div>

            <div class="admin-confirm-body">

                <p>${message}</p>

            </div>

            <div class="admin-confirm-footer">

                <button
                    class="ui-button ui-button-secondary"
                    id="confirmCancel">

                    ${cancelText}

                </button>

                <button
                    class="ui-button ui-button-${confirmStyle}"
                    id="confirmAccept">

                    ${confirmText}

                </button>

            </div>

        </div>

    `;

    document.body.appendChild(overlay);

    overlay
        .querySelector("#confirmCancel")
        .addEventListener("click", closeConfirmDialog);

    overlay
        .querySelector("#confirmAccept")
        .addEventListener("click", () => {

            closeConfirmDialog();

            onConfirm();

        });

    overlay.addEventListener("click", (event) => {

        if (event.target === overlay) {

            closeConfirmDialog();

        }

    });

}

function closeConfirmDialog() {

    document
        .querySelectorAll(".admin-confirm-overlay")
        .forEach(dialog => dialog.remove());

}