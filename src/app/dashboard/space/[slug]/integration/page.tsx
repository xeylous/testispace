import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import IntegrationGuide from "@/components/IntegrationGuide";

async function getSpaceData(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  await connectDB();
  // @ts-ignore
  const space = await Space.findOne({ slug, ownerId: session.user.id });
  if (!space) return null;

  return { space: { _id: space._id.toString() } };
}

export default async function IntegrationPage({ params }: { params: any }) {
    const { slug } = await params;
    const data = await getSpaceData(slug);

    if (!data) return notFound();

    const { space } = data;
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    return (
        <div className="space-y-8 mt-6">
            <div>
                <h2 className="text-xl font-bold mb-2">Integration & Embed</h2>
                <p className="text-muted-foreground">Get the code to add your testimonials to your website.</p>
            </div>

            <IntegrationGuide spaceId={space._id} baseUrl={baseUrl} />
        </div>
    );
}
