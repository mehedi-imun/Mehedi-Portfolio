"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/compat/router";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const router = useRouter();

  useEffect(() => {
    const handleHashNavigation = () => {
      if (router && router.asPath.includes("#")) {
        const id = router.asPath.split("#")[1];
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } else if (router && router.pathname === "/") {
        // Scroll to top when navigating to home without hash
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    handleHashNavigation(); // Call immediately on page load

    // Add a listener for route change events
    router?.events.on("routeChangeComplete", handleHashNavigation);

    // Clean up the listener when the component unmounts
    return () => {
      router?.events.off("routeChangeComplete", handleHashNavigation);
    };
  }, [router]);

  return (
    <div className="animate-fade-in mt-20">
      {children}
    </div>
  );
}
