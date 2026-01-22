import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import SettingsClient from "./SettingsClient";

async function getSpaceSettings(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  await connectDB();
  // @ts-ignore
  const space = await Space.findOne({ slug, ownerId: session.user.id });
  
  if (!space) return null;

  return {
      _id: space._id.toString(),
      name: space.name,
      slug: space.slug,
      headerTitle: space.headerTitle,
      customMessage: space.customMessage,
  };
}

export default async function SettingsPage({ params }: { params: any }) {
  const { slug } = await params;
  const space = await getSpaceSettings(slug);

  if (!space) return notFound();

  return <SettingsClient space={space} />;
}
