import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import Testimonial from "@/models/Testimonial";
import TestimonialsTable from "@/components/TestimonialsTable";
import EmbedCustomizer from "@/components/EmbedCustomizer";

async function getSpaceEmbedData(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  await connectDB();
  // @ts-ignore
  const space = await Space.findOne({ slug, ownerId: session.user.id });
  if (!space) return null;

  const testimonials = await Testimonial.find({ spaceId: space._id }).sort({ createdAt: -1 }).lean();
  
  // Convert to plain objects (reusing logic)
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
      embedLayout: space.embedLayout || 'grid',
      cardStyle: space.cardStyle || 'modern',
      customStyles: space.customStyles || {},
      selectedTestimonials: (space.selectedTestimonials || []).map((id: any) => id.toString()),
    },
    testimonials: plainTestimonials
  };
}

export default async function WallOfLovePage({ params }: { params: any }) {
    const { slug } = await params;
    const data = await getSpaceEmbedData(slug);
    
    if (!data) return notFound();

    const { space, testimonials } = data;
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    return (
        <div className="space-y-8 mt-6">
            <div>
                <h2 className="text-xl font-bold mb-2">Configure Your Wall of Love</h2>
                <p className="text-muted-foreground">Customize how testimonials appear and select the ones you want to showcase. Use the toggle below to select testimonials for your widget.</p>
            </div>

            {/* Embed Customization */}
            <EmbedCustomizer 
                spaceId={space._id} 
                baseUrl={baseUrl}
                currentLayout={space.embedLayout}
                currentStyle={space.cardStyle}
                currentCustomStyles={space.customStyles}
            />

            {/* Testimonials Selection */}
            <div className="glass-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold">Manage Selection</h2>
                </div>
                <TestimonialsTable 
                    testimonials={testimonials} 
                    baseUrl={baseUrl} 
                    spaceId={space._id}
                    initialSelectedTestimonials={space.selectedTestimonials}
                    itemsPerPage={15}
                    showSelection={true}
                    showEmbedCode={false} // Hiding individual embed code as requested
                />
            </div>
        </div>
    );
}
