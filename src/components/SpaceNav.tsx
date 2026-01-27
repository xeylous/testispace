"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Heart, Settings, BarChart3, Code, Palette } from "lucide-react";

export default function SpaceNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  
  // Helper to determine active state
  // Basic check: if it ends with the path or is the exact path
  const isActive = (path: string) => {
      // Exact match for base path
      if (path === `/dashboard/space/${slug}` && pathname === `/dashboard/space/${slug}`) return true;
      // Sub-path match
      if (path !== `/dashboard/space/${slug}` && pathname.startsWith(path)) return true;
      return false;
  };

  const tabs = [
    {
      name: "Overview",
      href: `/dashboard/space/${slug}`,
      icon: <LayoutGrid size={18} />,
    },
    {
      name: "Wall of Love",
      href: `/dashboard/space/${slug}/embed`,
      icon: <Heart size={18} />,
    },
    {
      name: "Analytics",
      href: `/dashboard/space/${slug}/analytics`,
      icon: <BarChart3 size={18} />,
    },
    {
      name: "Integration",
      href: `/dashboard/space/${slug}/integration`,
      icon: <Code size={18} />,
    },
    {
      name: "Customization",
      href: `/dashboard/space/${slug}/customization`,
      icon: <Palette size={18} />,
    },
    {
      name: "Settings",
      href: `/dashboard/space/${slug}/settings`,
      icon: <Settings size={18} />,
    },
  ];

  return (
    <div className="flex border-b border-border">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${
            isActive(tab.href)
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          {tab.icon}
          {tab.name}
        </Link>
      ))}
    </div>
  );
}
