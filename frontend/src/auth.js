export const isAdminLoggedIn = () => {
  return localStorage.getItem("admin_token") !== null;
};
