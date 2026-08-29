import { cn } from "@/lib/utils";
import React from "react";

export function GridBackgroundDemo({children}: {children: React.ReactNode}) {
  return (
    <div className="relative flex  w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black">
        
      </div>
      
      {/*
        w-full is required: this is a shrink-to-fit flex child, so without it the
        content collapses to its max-content width instead of filling the row.

        `relative z-10`, not a bare `z-40`: a flex item honours z-index even
        while statically positioned, so `z-40` put this whole section on the
        same layer as the fixed header -- and being later in the DOM, the
        project cards won the tie and scrolled over the navbar. Ten is enough to
        clear the two absolute background layers below and stays under the
        chrome.
      */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
