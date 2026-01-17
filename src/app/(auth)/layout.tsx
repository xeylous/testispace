import ThreeBackground from "@/components/ThreeBackground";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ThreeBackground />
      <div className="relative z-10 w-full max-w-md p-4">
        {children}
      </div>
    </div>
  );
}
