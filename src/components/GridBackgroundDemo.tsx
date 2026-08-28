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
      */}
      <div className="z-40 w-full">{children}</div>
    </div>
  );
}
