import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import SubmissionForm from "@/components/SubmissionForm";

async function getSpace(slug: string) {
  await connectDB();
  const space = await Space.findOne({ slug, status: "active" });
  if (!space) return null;
  return space;
}

export default async function PublicSpacePage({ params }: { params: any }) { 
    // Next.js 15/16 params are async
    const { spacePath } = await params;
    const space = await getSpace(spacePath);

    if (!space) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4 selection:bg-primary selection:text-white">
            <div className="max-w-3xl w-full">
               <div className="text-center mb-12">
                   {space.logo && <img src={space.logo} alt="Logo" className="w-20 h-20 rounded-full mx-auto mb-6 object-cover" />}
                   <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                       {space.headerTitle}
                   </h1>
                   <p className="text-xl text-muted-foreground">
                       {space.customMessage}
                   </p>
               </div>

               <div className="glass-card p-8 rounded-2xl shadow-2xl border-border">
                   <h2 className="text-2xl font-semibold mb-6 text-center">Send in your testimonial</h2>
                   <SubmissionForm spaceId={space._id.toString()} />
               </div>
               
               <div className="mt-8 text-center text-sm text-muted-foreground">
                   Powered by <span className="font-bold text-primary">TestiSpace</span>
               </div>
            </div>
        </div>
    );
}
