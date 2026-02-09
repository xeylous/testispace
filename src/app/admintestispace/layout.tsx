import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { LayoutDashboard, Users, LogOut, Home,Shield } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/admintestispace");
    }

    if (session.user.role !== "admin") {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        SuperAdmin
                    </h1>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <Link 
                        href="/admintestispace" 
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-foreground"
                    >
                        <LayoutDashboard size={20} />
                        Overview
                    </Link>
                    <Link 
                        href="/admintestispace/users" 
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-foreground"
                    >
                        <Users size={20} />
                        Users & Plans
                    </Link>
                    <Link 
                        href="/admintestispace/logs" 
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-foreground"
                    >
                        <Shield size={20} />
                        System Logs
                    </Link>
                    <Link 
                        href="/" 
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-foreground mt-8"
                    >
                        <Home size={20} />
                        Go to Website
                    </Link>
                </nav>

                <div className="p-4 border-t border-border">
                     <div className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {session.user.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="truncate font-medium text-foreground">{session.user.name}</p>
                            <p className="truncate text-xs">Admin</p>
                        </div>
                     </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
