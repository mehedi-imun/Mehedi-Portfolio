"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BUTTONDOWN_USERNAME = process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME;

/**
 * Buttondown embed: a static HTML form posting directly to Buttondown's
 * hosted endpoint, per their documented embed snippet. No SDK, no backend of
 * ours. Env-gated on NEXT_PUBLIC_BUTTONDOWN_USERNAME, the same convention
 * Comments.tsx uses for giscus -- an unconfigured deploy shows nothing rather
 * than a form that goes nowhere. See AGENTS.md for setup.
 */
export function NewsletterSignup() {
  if (!BUTTONDOWN_USERNAME) return null;

  return (
    <div className="rounded-xl border bg-muted/30 p-6">
      <h2 className="mb-1 text-lg font-semibold">Get new posts by email</h2>
      <p className="mb-4 text-sm text-muted-foreground">No spam. Unsubscribe anytime.</p>
      <form
        action={`https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`}
        method="post"
        target="popupwindow"
        onSubmit={() => {
          window.open(
            `https://buttondown.com/${BUTTONDOWN_USERNAME}`,
            "popupwindow",
            "scrollbars=yes,width=800,height=600"
          );
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <Input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          aria-label="Email address"
          className="sm:flex-1"
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </div>
  );
}

export default NewsletterSignup;
