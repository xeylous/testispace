import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import Testimonial from "@/models/Testimonial";

async function getSpaceStats(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  await connectDB();
  // @ts-ignore
  const space = await Space.findOne({ slug, ownerId: session.user.id });
  if (!space) return null;

  const testimonials = await Testimonial.find({ spaceId: space._id }).lean();
  
  return { 
    total: testimonials.length,
    approved: testimonials.filter((t: any) => t.isApproved).length,
    media: testimonials.filter((t: any) => t.mediaType !== 'none' && t.mediaType).length,
    text: testimonials.filter((t: any) => !t.mediaType || t.mediaType === 'none').length,
    latestTestimonials: testimonials.slice(0, 5) // Maybe for a quick list later
  };
}

export default async function SpaceOverviewPage({ params }: { params: any }) {
  const { slug } = await params;
  const stats = await getSpaceStats(slug);

  if (!stats) return notFound();
  
  return (
    <div className="space-y-8 mt-6">
      <div>
          <h2 className="text-xl font-bold mb-2">Overview</h2>
          <p className="text-muted-foreground">Quick insights into your testimonial collection.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-xl">
             <h3 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Total Received</h3>
             <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
             <h3 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Approved</h3>
             <p className="text-4xl font-bold text-green-500">{stats.approved}</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
             <h3 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Video/Image</h3>
             <p className="text-4xl font-bold text-purple-400">{stats.media}</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
             <h3 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Text Only</h3>
             <p className="text-4xl font-bold text-blue-400">{stats.text}</p>
        </div>
      </div>

      <div className="p-8 border border-border rounded-xl bg-background/50 text-center space-y-4">
           <h3 className="text-lg font-medium">Ready to showcase your testimonials?</h3>
           <p className="text-muted-foreground max-w-lg mx-auto">
               Head over to the <span className="text-primary font-bold">Wall of Love</span> tab to customize your widget and select the best testimonials to display on your website.
           </p>
           <Link 
             href={`/dashboard/space/${slug}/embed`}
             className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-lg font-medium transition-colors"
           >
             Go to Wall of Love
           </Link>
      </div>
    </div>
  );
}
