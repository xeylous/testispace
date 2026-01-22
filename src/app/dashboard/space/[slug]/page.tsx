import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import Testimonial from "@/models/Testimonial";
import TestimonialsTable from "@/components/TestimonialsTable";

async function getSpaceData(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  await connectDB();
  // @ts-ignore
  const space = await Space.findOne({ slug, ownerId: session.user.id });
  if (!space) return null;

  const testimonials = await Testimonial.find({ spaceId: space._id }).sort({ createdAt: -1 }).lean();
  
  // Convert to plain objects
  const plainTestimonials = testimonials.map((t: any) => {
    // Robust mapping for old vs new testimonials
    const rawMediaType = t.mediaType || t.type;
    const isMedia = rawMediaType === 'image' || rawMediaType === 'video';
    
    const mediaType = isMedia ? rawMediaType : 'none';
    const mediaUrl = t.mediaUrl || (isMedia ? t.content : "");
    // Only fall back to content if it's NOT media, otherwise we get the URL as text
    const textContent = t.textContent || (!isMedia ? t.content : "");

    return {
      _id: t._id.toString(),
      textContent,
      mediaUrl,
      mediaType,
      type: t.type, // keeping for compat
      content: t.content, // keeping for compat
      rating: t.rating,
      userDetails: {
        name: t.userDetails?.name || "Anonymous",
        email: t.userDetails?.email || '',
        designation: t.userDetails?.designation || '',
        avatar: t.userDetails?.avatar || '',
      },
      isApproved: t.isApproved,
      isArchived: t.isArchived,
      createdAt: t.createdAt ? t.createdAt.toISOString() : new Date().toISOString(),
    };
  });
  
  return { 
    space: {
      _id: space._id.toString(),
      name: space.name,
      slug: space.slug,
    }, 
    testimonials: plainTestimonials 
  };
}

export default async function SpaceManagementPage({ params }: { params: any }) {
  const { slug } = await params;
  const data = await getSpaceData(slug);

  if (!data) return notFound();
  
  const { space, testimonials } = data;
  const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {space.name}
            </h1>
            <a href={`/${space.slug}`} target="_blank" className="text-muted-foreground hover:text-accent flex items-center gap-1 text-sm">
                Public Link: <span className="underline">{baseUrl}/{space.slug}</span>
            </a>
        </div>
        <div className="flex gap-4">
             <Link 
                href={`/dashboard/space/${space.slug}/settings`}
                className="bg-secondary/50 text-secondary-foreground border border-secondary-foreground/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/70 transition-colors flex items-center gap-2"
             >
                 Settings
             </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 rounded-xl">
             <h3 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total</h3>
             <p className="text-3xl font-bold">{testimonials.length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
             <h3 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Approved</h3>
             <p className="text-3xl font-bold text-green-500">{testimonials.filter((t) => t.isApproved).length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
             <h3 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Media</h3>
             <p className="text-3xl font-bold">{testimonials.filter((t) => t.mediaType !== 'none').length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
             <h3 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Text Only</h3>
             <p className="text-3xl font-bold">{testimonials.filter((t) => t.mediaType === 'none').length}</p>
        </div>
      </div>

      {/* Embed Code Section */}
      <div className="glass-card p-6 rounded-xl mb-8 border border-border">
        <h2 className="text-xl font-bold mb-4">Embed All Testimonials</h2>
        <p className="text-muted-foreground mb-4">Copy and paste this code to embed all approved testimonials.</p>
        <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-green-400 overflow-x-auto">
            <code>
                &lt;script src=&quot;{baseUrl}/embed.js&quot; data-space-id=&quot;{space._id}&quot; data-layout=&quot;grid&quot;&gt;&lt;/script&gt;
            </code>
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">All Testimonials</h2>
        </div>
        <TestimonialsTable testimonials={testimonials} baseUrl={baseUrl} />
      </div>
    </div>
  );
}

