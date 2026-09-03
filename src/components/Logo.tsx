import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

// One wordmark image, inverted to white in dark mode via a CSS filter. Two
// separate <img>s toggled with dark:hidden/dark:block used to unpaint one
// and paint the other in the same frame on a live theme switch, which read
// as the logo blinking; a filter on a single mounted image can't do that.
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src="/asset/logo/mehedi-logo-black.png"
        alt={siteConfig.name}
        width={1699}
        height={684}
        priority
        className="h-8 w-auto dark:invert"
      />
    </Link>
  );
}
