import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../features/auth/api";
import { Button } from "./ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";

export function AppLayout() {
  const { user, token } = useAuthStore();
  const logoutMutation = useLogout();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
            <LayoutDashboard className="w-5 h-5" />
            Team Tasks
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-right hidden sm:block">
            <p className="font-medium">{user.full_name}</p>
            <p className="text-zinc-500 text-xs">{user.role}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
