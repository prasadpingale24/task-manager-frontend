export type Role = "MANAGER" | "MEMBER";
export type TaskStatus = "ACTIVE" | "PENDING" | "COMPLETE";

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  role: Role;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
}

export interface ProjectMemberUserInfo {
  id: string;
  email: string;
  full_name: string;
}

export interface ProjectMemberListResponse {
  id: string;
  project_id: string;
  joined_at: string;
  user: ProjectMemberUserInfo;
}

export interface ProjectMemberResponse {
  id: string;
  project_id: string;
  user_id: string;
  joined_at: string;
}

export interface MemberTaskStatus {
  user_id: string;
  full_name: string;
  status: TaskStatus;
  updated_at: string;
}

export interface TaskResponse {
  id: string;
  project_id: string;
  created_by_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface TaskOwnerResponse extends TaskResponse {
  member_statuses: MemberTaskStatus[];
}
