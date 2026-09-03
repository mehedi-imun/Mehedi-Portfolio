import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

/**
 * Author card reusing the same facts personSchema() already exposes via
 * personId (name, jobTitle, description, portrait) -- the visible bio and the
 * JSON-LD Person describe one identity, which is what an E-E-A-T signal is
 * meant to demonstrate rather than just declare in markup nobody sees.
 */
export function AuthorBio() {
  return (
    <div className="flex items-start gap-4 rounded-xl border bg-card p-6">
      <Image
        src="/hero-portrait.png"
        alt={siteConfig.name}
        width={56}
        height={56}
        className="rounded-full object-cover"
      />
      <div>
        <p className="font-semibold">{siteConfig.name}</p>
        <p className="text-sm text-muted-foreground">{siteConfig.jobTitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">{siteConfig.description}</p>
        <Link
          href="/about"
          className="mt-2 inline-block text-sm font-medium underline-offset-4 hover:underline"
        >
          More about {siteConfig.name.split(" ")[0]}
        </Link>
      </div>
    </div>
  );
}

export default AuthorBio;
