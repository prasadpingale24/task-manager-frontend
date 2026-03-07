import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { useAuthStore } from "../../store/authStore";
import { UserResponse, TokenResponse } from "../../types/api";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  return useMutation({
    mutationFn: async (credentials: any) => {
      // 1. Login to get token
      const loginRes = await apiClient.post<TokenResponse>("/auth/login", credentials);
      const { access_token } = loginRes.data;
      
      // 2. Temporarily set token in axios instance for the profile call
      // (The interceptor will pick it up from the store, but we set it here to be safe)
      useAuthStore.setState({ token: access_token });
      
      // 3. Fetch profile
      const userRes = await apiClient.get<UserResponse>(`/auth/me`);
      
      return { token: access_token, user: userRes.data };
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
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
