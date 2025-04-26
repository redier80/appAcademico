import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getStorage, saveStorage } from "../utils/localStorage";
import axios from "axios";
import { toast } from "react-toastify";
import { getTimeExpToken, getUserToken } from "../utils/jwt";
import { get } from "react-hook-form";

const useAuth = create(
  devtools((set) => ({
    username: null,
    token: null,
    isLogged: false,

    login: async (username, password) => {
      const URL = "http://localhost:9090/apis/codigo/auth";
      try {
        const response = await axios.post(`${URL}/login`, {
          username,
          password,
        });

        if (response.status === 200) {
          const { token } = response.data;
          saveStorage("token", token);
          set({ username, token, isLogged: true }, false, "auth/login");
          toast.success("Bienvenido " + username);
        }
      } catch (error) {
        toast.error(error.response.data.error);
      }
    },
    logout: () => {
      localStorage.removeItem("token");
      set(
        { username: null, token: null, isLogged: false },
        false,
        "auth/logout"
      );
    },
    verifyAuth: () => {
      const token = getStorage("token");

      if (!token) return;
      try {
        const currentTime = new Date().getTime() / 1000;
        const timeExpToken = getTimeExpToken(token);
        const username = getUserToken(token);
        if (timeExpToken > currentTime) {
          set({ token, username, isLogged: true }, false, "auth/verifyAuth");
        } else {
          localStorage.removeItem("token");
          set(
            { username: null, token: null, isLogged: false },
            false,
            "auth/verifyAuth"
          );
        }
      } catch (error) {
        localStorage.removeItem("token");
        set(
          { username: null, token: null, isLogged: false },
          false,
          "auth/verifyAuth"
        );
      }
    },
  }))
);

export default useAuth;
