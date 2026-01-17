import Link from "next/link";
import { Plus, Settings, MessageSquare, ExternalLink } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";

async function getSpaces() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return [];

  await connectDB();
  // @ts-ignore
  const spaces = await Space.find({ ownerId: session.user.id }).sort({ createdAt: -1 });
  return spaces;
}

export default async function DashboardPage() {
  const spaces = await getSpaces();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Your Spaces</h2>
        <Link 
            href="/dashboard/new-space"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
            <Plus size={20} />
            Create Space
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces.length === 0 ? (
            <div className="glass-card p-12 rounded-xl border-dashed border-2 border-border flex flex-col items-center justify-center text-center col-span-full">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                    <Plus size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Spaces yet</h3>
                <p className="text-muted-foreground mb-6">Create your first space to start collecting testimonials.</p>
                <Link 
                    href="/dashboard/new-space"
                    className="text-accent hover:underline"
                >
                    Create new space &rarr;
                </Link>
            </div>
        ) : (
            spaces.map((space: any) => (
                <div key={space._id} className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold truncate">{space.name}</h3>
                        <Link href={`/${space.slug}`} target="_blank" className="text-muted-foreground hover:text-accent">
                            <ExternalLink size={18} />
                        </Link>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                         <div className="flex items-center gap-1">
                            <MessageSquare size={16} />
                            <span>0 Testimonials</span> 
                         </div>
                         <Link href={`/dashboard/space/${space.slug}`} className="ml-auto flex items-center gap-1 hover:text-white transition-colors">
                            <Settings size={16} />
                            Manage
                         </Link>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
