function isAstreaAdmin() {
  return ADMIN_STATE.user.role === ADMIN_CONFIG.roles.astrea;
}

function isCommerceAdmin() {
  return ADMIN_STATE.user.role === ADMIN_CONFIG.roles.commerce;
}