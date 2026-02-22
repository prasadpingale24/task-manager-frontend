import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject, useUpdateProject, useDeleteProject, useProjectMembers, useAddProjectMember, useRemoveProjectMember } from "../features/projects/api";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "../features/tasks/api";
import { useAuthStore } from "../store/authStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { MoreVertical, Plus, Trash2, Edit2, UserPlus, CheckCircle2, Circle, Clock } from "lucide-react";
import { TaskStatus, TaskOwnerResponse } from "../types/api";
import { format } from "date-fns";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const { data: project, isLoading: isProjectLoading } = useProject(id!);
  const { data: members, isLoading: isMembersLoading } = useProjectMembers(id!);
  const { data: tasks, isLoading: isTasksLoading } = useTasks(id!);
  
  const updateProjectMutation = useUpdateProject(id!);
  const deleteProjectMutation = useDeleteProject();
  const addMemberMutation = useAddProjectMember(id!);
  const removeMemberMutation = useRemoveProjectMember(id!);
  const createTaskMutation = useCreateTask(id!);
  const updateTaskMutation = useUpdateTask(id!);
  const deleteTaskMutation = useDeleteTask(id!);

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("PENDING");

  const isOwner = project?.owner_id === user?.id;

  if (isProjectLoading || isMembersLoading || isTasksLoading) {
    return <div className="flex items-center justify-center h-64">Loading project details...</div>;
  }

  if (!project) {
    return <div className="text-center py-12">Project not found</div>;
  }

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectMutation.mutate({ name: projectName, description: projectDesc }, {
      onSuccess: () => setIsEditProjectOpen(false)
    });
  };

  const handleDeleteProject = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(id!, {
        onSuccess: () => navigate("/")
      });
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    addMemberMutation.mutate({ user_id: newMemberId }, {
      onSuccess: () => {
        setIsAddMemberOpen(false);
        setNewMemberId("");
      }
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate({ title: taskTitle, description: taskDesc, status: taskStatus, project_id: id! }, {
      onSuccess: () => {
        setIsCreateTaskOpen(false);
        setTaskTitle("");
        setTaskDesc("");
        setTaskStatus("PENDING");
      }
    });
  };

  const StatusIcon = ({ status }: { status: TaskStatus }) => {
    switch (status) {
      case "COMPLETE": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "ACTIVE": return <Clock className="w-4 h-4 text-amber-500" />;
      case "PENDING": return <Circle className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-zinc-500 mt-2 max-w-2xl">{project.description}</p>
        </div>
        
        {isOwner && (
          <div className="flex items-center gap-2">
            <Dialog open={isEditProjectOpen} onOpenChange={(open) => {
              setIsEditProjectOpen(open);
              if (open) {
                setProjectName(project.name);
                setProjectDesc(project.description || "");
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleUpdateProject}>
                  <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input id="edit-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-desc">Description</Label>
                      <Input id="edit-desc" value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={updateProjectMutation.isPending}>Save Changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="destructive" size="sm" onClick={handleDeleteProject} disabled={deleteProjectMutation.isPending}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateTask}>
                  <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Title</Label>
                      <Input id="task-title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-desc">Description</Label>
                      <Input id="task-desc" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Initial Status</Label>
                      <select 
                        className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm"
                        value={taskStatus}
                        onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETE">Complete</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={createTaskMutation.isPending}>Create Task</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {tasks?.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/20">
                No tasks yet. Create one to get started.
              </div>
            ) : (
              tasks?.map((task) => {
                const isTaskCreator = task.created_by_id === user?.id;
                const taskOwnerData = task as TaskOwnerResponse;
                const hasMemberStatuses = taskOwnerData.member_statuses !== undefined;

                return (
                  <Card key={task.id} className="overflow-hidden">
                    <div className="p-5 flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-lg leading-none">{task.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={task.status === "COMPLETE" ? "default" : task.status === "ACTIVE" ? "secondary" : "outline"}>
                              {task.status}
                            </Badge>
                            {(isOwner || isTaskCreator) && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => {
                                      if (confirm("Delete this task?")) {
                                        deleteTaskMutation.mutate(task.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Task
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{task.description}</p>
                        <div className="text-xs text-zinc-500 flex items-center gap-2 pt-2">
                          <Clock className="w-3 h-3" />
                          Created {format(new Date(task.created_at), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>

                    {/* Member Statuses (If Owner) */}
                    {hasMemberStatuses && taskOwnerData.member_statuses.length > 0 && (
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 border-t px-5 py-3">
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Team Progress</h4>
                        <div className="space-y-2">
                          {taskOwnerData.member_statuses.map((ms) => (
                            <div key={ms.user_id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-[10px]">{(ms.full_name || "??").substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span>{ms.full_name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-zinc-600">
                                <StatusIcon status={ms.status} />
                                <span className="text-xs font-medium">{ms.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Personal Status Update (If Member) */}
                    {!isOwner && (
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 border-t px-5 py-3 flex items-center justify-between">
                        <span className="text-sm font-medium">My Status</span>
                        <div className="flex gap-2">
                          {(["PENDING", "ACTIVE", "COMPLETE"] as TaskStatus[]).map((s) => (
                            <Button
                              key={s}
                              variant={task.status === s ? "default" : "outline"}
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => {
                                updateTaskMutation.mutate({ taskId: task.id, data: { status: s } });
                              }}
                              disabled={updateTaskMutation.isPending}
                            >
                              {s}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar - Members */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Team Members</CardTitle>
                {isOwner && (
                  <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleAddMember}>
                        <DialogHeader>
                          <DialogTitle>Add Member</DialogTitle>
                          <DialogDescription>Enter the user ID to add them to this project.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="user-id">User ID</Label>
                            <Input id="user-id" value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)} required placeholder="uuid-..." />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={addMemberMutation.isPending}>Add Member</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members?.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-4">No members yet.</p>
                ) : (
                  members?.map((member) => (
                    <div key={member.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{(member.user.full_name || "??").substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{member.user.full_name}</p>
                          <p className="text-xs text-zinc-500 mt-1">{member.user.email}</p>
                        </div>
                      </div>
                      {isOwner && member.user.id !== user?.id && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            if (confirm("Remove this member?")) {
                              removeMemberMutation.mutate(member.user.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
