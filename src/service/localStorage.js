export const setLoginData = (token, id, email, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("email", email);
  localStorage.setItem("role", role);
  localStorage.setItem("id", id);
};
export const removeLoginData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("id");
};
export const getLoginData = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");
  return { token, email, role, id };
};
