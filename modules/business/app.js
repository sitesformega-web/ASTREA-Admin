/* ==========================================================================
   ASTREA™ Admin
   Business Module
   ========================================================================== */


/**
 * Carga Business desde el backend
 * y sincroniza ADMIN_STATE.
 */
async function loadBusiness() {
  const business =
    await adminFetchBusiness();

  setBusiness(business);

  return business;
}


/**
 * Guarda una sección de Business
 * y sincroniza el estado con la respuesta real del backend.
 *
 * section:
 *   - info
 *   - contact
 *   - schedule
 */
async function saveBusinessSection(
  section,
  data
) {
  const result =
    await adminUpdateBusiness(
      section,
      data
    );

  if (result.business) {
    setBusiness(result.business);
  }

  return result;
}
