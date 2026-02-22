import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { TaskResponse, TaskOwnerResponse, TaskStatus } from "../../types/api";

export const useTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await apiClient.get<(TaskResponse | TaskOwnerResponse)[]>("/tasks", {
        params: { project_id: projectId },
      });
      return res.data;
    },
    enabled: !!projectId,
  });
};

export const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; description: string; status: TaskStatus; project_id: string }) => {
      const res = await apiClient.post<TaskResponse>("/tasks", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
};

export const useUpdateTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, data }: { taskId: string; data: { title?: string; description?: string; status?: TaskStatus } }) => {
      const res = await apiClient.patch<TaskResponse>(`/tasks/${taskId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
};

export const useDeleteTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      await apiClient.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
};
