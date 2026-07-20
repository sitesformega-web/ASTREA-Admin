/* ==========================================================
   ASTREA™ Design System
   Admin Components

   Search Toolbar
   ========================================================== */

function renderSearchToolbar(options = {}) {

  const {

    id = "search",

    placeholder = "Buscar...",

    value = ""

  } = options;

  return `

    <div class="admin-search-toolbar">

      <input
        id="${id}"
        type="search"
        placeholder="${placeholder}"
        autocomplete="off"
        value="${value}"
      >

    </div>

  `;

}