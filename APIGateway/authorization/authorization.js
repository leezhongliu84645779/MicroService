var accessIntensity = ["user", "admin", "superadmin"];


module.exports.userAuthorization = function(tokenRole, requireRole) {
  return true;
}
