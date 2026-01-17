import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Basic layout for now, will add Sidebar/Topbar components next */}
      <header className="border-b border-border p-4 flex justify-between items-center glass-card">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TestiSpace
        </h1>
        <div className="flex items-center gap-4">
             {/* User Profile / Sign Out placeholder */}
             <span className="text-sm text-muted-foreground">{session.user?.email}</span>
        </div>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
