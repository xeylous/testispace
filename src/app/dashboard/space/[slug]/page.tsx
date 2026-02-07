import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import Testimonial from "@/models/Testimonial";
import TestimonialsTable from "@/components/TestimonialsTable"; // Import added back

async function getSpaceStats(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  await connectDB();
  // @ts-ignore
  const space = await Space.findOne({ slug, ownerId: session.user.id });
  if (!space) return null;

  const testimonials = await Testimonial.find({ spaceId: space._id }).sort({ createdAt: -1 }).lean();
  
  // Convert to plain objects
  const plainTestimonials = testimonials.map((t: any) => {
    const rawMediaType = t.mediaType || t.type;
    const isMedia = rawMediaType === 'image' || rawMediaType === 'video';
    
    return {
      _id: t._id.toString(),
      textContent: t.textContent || (!isMedia ? t.content : ""),
      mediaUrl: t.mediaUrl || (isMedia ? t.content : ""),
      mediaType: isMedia ? rawMediaType : 'none',
      type: t.type,
      content: t.content,
      rating: t.rating,
      userDetails: {
        name: t.userDetails?.name || "which will be best",
        email: t.userDetails?.email || '',
        designation: t.userDetails?.designation || '',
        avatar: t.userDetails?.avatar || '',
      },
      displaySettings: t.displaySettings || {
        showExperience: true,
        showImage: true,
        showName: true,
        showDesignation: true
      },
      isApproved: t.isApproved,
      isArchived: t.isArchived,
      createdAt: t.createdAt ? t.createdAt.toISOString() : new Date().toISOString(),
    };
  });

  return { 
    space: { _id: space._id.toString() },
    testimonials: plainTestimonials,
    stats: {
        total: testimonials.length,
        approved: testimonials.filter((t: any) => t.isApproved).length,
        media: testimonials.filter((t: any) => t.mediaType !== 'none' && t.mediaType).length,
        text: testimonials.filter((t: any) => !t.mediaType || t.mediaType === 'none').length,
    }
  };
}

export default async function SpaceOverviewPage({ params }: { params: any }) {
  const { slug } = await params;
  const data = await getSpaceStats(slug);

  if (!data) return notFound();
  
  const { space, testimonials, stats } = data;
  const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  
  return (
    <div className="space-y-8 mt-6">
      <div>
          <h2 className="text-xl font-bold mb-2">Overview</h2>
          <p className="text-muted-foreground">Quick insights into your testimonial collection.</p>
      </div>

      {/* Stats - Removed and moved to Analytics */}
      
      {/* Recent Testimonials Table */}

     {/* Recent Testimonials Table */}
     <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Testimonials</h2>
            <Link href={`/dashboard/space/${slug}/embed`} className="text-sm text-primary hover:underline">
                Manage Selection &rarr;
            </Link>
        </div>
        <TestimonialsTable 
            testimonials={testimonials} 
            baseUrl={baseUrl} 
            spaceId={space._id}
            itemsPerPage={5}
            showSelection={false}
            showEmbedCode={false} // Hiding specific embed code as requested for overview logic
        />
     </div>
    </div>
  );
}
