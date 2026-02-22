import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects, useCreateProject } from "../features/projects/api";
import { useAuthStore } from "../store/authStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Plus, Folder } from "lucide-react";

export function Dashboard() {
  const { user } = useAuthStore();
  const { data: projects, isLoading } = useProjects();
  const createProjectMutation = useCreateProject();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate(
      { name, description },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          setName("");
          setDescription("");
        },
      }
    );
  };

  const ownedProjects = projects?.filter((p) => p.owner_id === user?.id) || [];
  const memberProjects = projects?.filter((p) => p.owner_id !== user?.id) || [];

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading projects...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Manage your projects and tasks.</p>
        </div>
        
        {user?.role === "MANAGER" && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create Project</DialogTitle>
                  <DialogDescription>Add a new project to manage tasks and team members.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Project Alpha" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createProjectMutation.isPending}>
                    {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {projects?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20">
          <Folder className="w-12 h-12 text-zinc-400 mb-4" />
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-zinc-500 text-sm mt-1 mb-4">You don't have any projects yet.</p>
          {user?.role === "MANAGER" && (
            <Button onClick={() => setIsCreateOpen(true)}>Create your first project</Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {ownedProjects.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Owned Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedProjects.map((project) => (
                  <Link key={project.id} to={`/projects/${project.id}`}>
                    <Card className="hover:border-zinc-300 transition-colors cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{project.description || "No description"}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {memberProjects.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Member Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {memberProjects.map((project) => (
                  <Link key={project.id} to={`/projects/${project.id}`}>
                    <Card className="hover:border-zinc-300 transition-colors cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{project.description || "No description"}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
