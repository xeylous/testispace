"use client";

import { useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function PublicSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Hide global navbar and footer on public feedback pages
    const navbar = document.getElementById("global-navbar");
    const footer = document.getElementById("global-footer");
    
    if (navbar) navbar.style.display = "none";
    if (footer) footer.style.display = "none";

    // Cleanup: restore on unmount
    return () => {
      if (navbar) navbar.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  return (
    <>
      {/* Theme toggle in top right corner for public pages */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {children}
    </>
  );
}
