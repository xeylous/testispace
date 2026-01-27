import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import Testimonial from "@/models/Testimonial";
import AnalyticsCharts from "@/components/AnalyticsCharts"; // We'll create this

async function getAnalyticsData(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  await connectDB();
  // @ts-ignore
  const space = await Space.findOne({ slug, ownerId: session.user.id });
  if (!space) return null;

  const testimonials = await Testimonial.find({ spaceId: space._id }).lean();
  
  // Calculate Stats
  const stats = {
        total: testimonials.length,
        approved: testimonials.filter((t: any) => t.isApproved).length,
        media: testimonials.filter((t: any) => (t.mediaType !== 'none' && t.mediaType) || t.type === 'video' || t.type === 'image').length,
        text: testimonials.filter((t: any) => !t.mediaType || t.mediaType === 'none').length,
  };

  // Mock engagement data (Server Side Generation)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        views: Math.floor(Math.random() * 50) + 10,
        clicks: Math.floor(Math.random() * 20) + 2,
    };
  });

  return { stats, chartData };
}

export default async function AnalyticsPage({ params }: { params: any }) {
    const { slug } = await params;
    const data = await getAnalyticsData(slug);

    if (!data) return notFound();

    const { stats, chartData } = data;

    return (
        <div className="space-y-8 mt-6">
            <div>
                <h2 className="text-xl font-bold mb-2">Analytics Overview</h2>
                <p className="text-muted-foreground">Deep insights into your testimonial collection and performance.</p>
            </div>

            {/* Stats Cards - Moved from Overview */}
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

            {/* Engagement Charts */}
            <AnalyticsCharts data={chartData} />
        </div>
    );
}
