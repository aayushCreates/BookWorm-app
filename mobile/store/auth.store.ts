import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { create } from "zustand";

const BASE_URL = process.env.BASE_API_URL || "http://10.0.2.2:5050";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post(`${BASE_URL}/api/v1/auth/register`, {
        name,
        email,
        password,
      });

      console.log("data response: ", data);

      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      set({
        token: data.token,
        user: data.data,
        isLoading: false,
      });

      await AsyncStorage.setItem("user", JSON.stringify(data.data));
      await AsyncStorage.setItem("token", JSON.stringify(data.token));

      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      return {
        success: false,
        err: err.response?.data?.message || err.message,
      };
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
        email,
        password,
      });

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      set({
        token: data.token,
        user: data.data,
        isLoading: false,
      });

      await AsyncStorage.setItem("user", JSON.stringify(data.data));
      await AsyncStorage.setItem("token", JSON.stringify(data.token));

      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      return {
        success: false,
        err: err.response?.data?.message || err.message,
      };
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      if(!token || !userJson) {
        return {
          success: false
        }
      }

      const user = userJson ? JSON.parse(userJson) : null;
      set({
        user,
        token,
      });

      return {
        success: true
      }
    } catch (err) {
      console.log("Auth check failed", err);
    }
  },
}));
