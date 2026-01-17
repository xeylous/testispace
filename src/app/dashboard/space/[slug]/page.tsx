import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import Testimonial from "@/models/Testimonial";
import TestimonialCard from "@/components/TestimonialCard";
import { Star, Video, Image as ImageIcon, MessageSquare, CheckCircle, XCircle } from "lucide-react";

async function getSpaceData(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  await connectDB();
  // @ts-ignore
  const space = await Space.findOne({ slug, ownerId: session.user.id });
  if (!space) return null;

  const testimonials = await Testimonial.find({ spaceId: space._id }).sort({ createdAt: -1 });
  return { space, testimonials };
}

export default async function SpaceManagementPage({ params }: { params: any }) {
  const { slug } = await params;
  const data = await getSpaceData(slug);

  if (!data) return notFound();
  
  const { space, testimonials } = data;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {space.name}
            </h1>
            <a href={`/${space.slug}`} target="_blank" className="text-muted-foreground hover:text-accent flex items-center gap-1 text-sm">
                Public Link: <span className="underline">testispace/{space.slug}</span>
            </a>
        </div>
        <div className="flex gap-4">
             {/* Future: Edit Space Settings Button */}
             <button className="bg-secondary/20 text-secondary border border-secondary/50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/30 transition-colors">
                 Settings
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-xl">
             <h3 className="text-sm text-muted-foreground uppercase font-bold tracking-wider mb-2">Total</h3>
             <p className="text-4xl font-bold">{testimonials.length}</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
             <h3 className="text-sm text-muted-foreground uppercase font-bold tracking-wider mb-2">Video</h3>
             <p className="text-4xl font-bold">{testimonials.filter((t: any) => t.type === 'video').length}</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
             <h3 className="text-sm text-muted-foreground uppercase font-bold tracking-wider mb-2">Text</h3>
             <p className="text-4xl font-bold">{testimonials.filter((t: any) => t.type === 'text').length}</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl mb-8 border border-border">
        <h2 className="text-xl font-bold mb-4">Embed to your website</h2>
        <p className="text-muted-foreground mb-4">Copy and paste this code where you want the testimonials to appear.</p>
        <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-green-400 overflow-x-auto relative group">
            <code>
                &lt;script src=&quot;{process.env.NEXTAUTH_URL}/embed.js&quot; data-space-id=&quot;{space._id}&quot; data-layout=&quot;grid&quot;&gt;&lt;/script&gt;
            </code>
            <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                Copy code
            </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Inbox</h2>
      
      <div className="space-y-4">
        {testimonials.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-xl border-dashed border border-border">
                <p className="text-muted-foreground">No testimonials yet.</p>
            </div>
        ) : (
            testimonials.map((t: any) => (
                <TestimonialCard key={t._id} testimonial={JSON.parse(JSON.stringify(t))} />
            ))
        )}
      </div>
    </div>
  );
}
