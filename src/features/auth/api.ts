import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { useAuthStore } from "../../store/authStore";
import { UserResponse, TokenResponse } from "../../types/api";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post<TokenResponse>("/auth/login", data);
      return res.data;
    },
    onSuccess: async (data) => {
      // After getting token, fetch profile
      useAuthStore.setState({ token: data.access_token });
      const userRes = await apiClient.get<UserResponse>("/auth/me");
      setAuth(data.access_token, userRes.data);
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post("/auth/signup", data);
      return res.data;
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
    },
    onSettled: () => {
      logout();
    },
  });
};
