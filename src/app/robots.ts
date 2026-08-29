import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    /*
     * Nothing is disallowed, deliberately.
     *
     * `/_next/` used to be blocked as "internals with no standalone value",
     * but that is where the CSS and JS bundles live, and Googlebot renders the
     * page before indexing it. Blocking them hides the site's own stylesheets
     * from the renderer -- Search Console reports it as a blocked resource and
     * mobile-first indexing sees an unstyled, unhydrated page. Google's own
     * guidance is explicit: do not block CSS or JS.
     */
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
