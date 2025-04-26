import { jwtDecode } from "jwt-decode";
const getTimeExpToken = (token) => {
  try {
    return jwtDecode(token).exp;
  } catch (error) {
    return null;
  }
};
const getUserToken = (token) => {
  try {
    return jwtDecode(token).sub;
  } catch (error) {
    return null;
  }
};

export { getTimeExpToken, getUserToken };
