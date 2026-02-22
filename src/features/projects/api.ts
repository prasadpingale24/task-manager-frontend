import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { ProjectResponse, ProjectMemberListResponse, ProjectMemberResponse } from "../../types/api";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await apiClient.get<ProjectResponse[]>("/projects");
      return res.data;
    },
  });
};

export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const res = await apiClient.get<ProjectResponse>(`/projects/${projectId}`);
      return res.data;
    },
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await apiClient.post<ProjectResponse>("/projects", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name?: string; description?: string }) => {
      const res = await apiClient.put<ProjectResponse>(`/projects/${projectId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) => {
      await apiClient.delete(`/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "members"],
    queryFn: async () => {
      const res = await apiClient.get<ProjectMemberListResponse[]>(`/projects/${projectId}/members`);
      return res.data;
    },
    enabled: !!projectId,
  });
};

export const useAddProjectMember = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { user_id: string }) => {
      const res = await apiClient.post<ProjectMemberResponse>(`/projects/${projectId}/members`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "members"] });
    },
  });
};

export const useRemoveProjectMember = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(`/projects/${projectId}/members/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "members"] });
    },
  });
};
