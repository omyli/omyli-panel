export const getUserDataFromToken = (token) => {
  const emailToken = token.split(".");
  const jsonToken = atob(emailToken[1]);
  const dataFromToken = JSON.parse(jsonToken);
  const { sub, role, id } = dataFromToken;
  return { email: sub, role, id: id };
};
