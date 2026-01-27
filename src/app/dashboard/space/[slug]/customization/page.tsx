import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import EmbedCustomizer from "@/components/EmbedCustomizer";

async function getSpaceCustomizationData(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  await connectDB();
  // @ts-ignore
  const space = await Space.findOne({ slug, ownerId: session.user.id });
  if (!space) return null;

  return {
    space: {
      _id: space._id.toString(),
      embedLayout: space.embedLayout || 'grid',
      cardStyle: space.cardStyle || 'modern',
      customStyles: space.customStyles || {},
    }
  };
}

export default async function CustomizationPage({ params }: { params: any }) {
    const { slug } = await params;
    const data = await getSpaceCustomizationData(slug);
    
    if (!data) return notFound();

    const { space } = data;
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    return (
        <div className="space-y-8 mt-6">
            <div>
                <h2 className="text-xl font-bold mb-2">Testimonials Customization</h2>
                <p className="text-muted-foreground">Customize how your testimonials will appear on your website.</p>
            </div>

            <EmbedCustomizer 
                spaceId={space._id} 
                baseUrl={baseUrl}
                currentLayout={space.embedLayout}
                currentStyle={space.cardStyle}
                currentCustomStyles={space.customStyles}
            />
        </div>
    );
}
