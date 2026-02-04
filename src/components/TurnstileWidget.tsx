"use client";

import { useEffect, useRef } from "react";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  siteKey?: string;
  theme?: "light" | "dark" | "auto";
}

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function TurnstileWidget({ onVerify, siteKey, theme = "auto" }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    // If site key is not provided, use the testing key that always passes
    const key = siteKey || process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || "1x00000000000000000000AA";

    if (!window.turnstile) {
        // Load the script if not already loaded
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
             renderWidget(key);
        };
    } else {
        renderWidget(key);
    }

    return () => {
        if (widgetId.current && window.turnstile) {
            window.turnstile.remove(widgetId.current);
            widgetId.current = null;
        }
    };
  }, [siteKey, theme]);

  const renderWidget = (key: string) => {
      if (containerRef.current && window.turnstile && !widgetId.current) {
          widgetId.current = window.turnstile.render(containerRef.current, {
              sitekey: key,
              callback: (token: string) => {
                  onVerify(token);
              },
              theme: theme,
          });
      }
  };

  return <div ref={containerRef} className="my-4 flex justify-center min-h-[65px]" />;
}
