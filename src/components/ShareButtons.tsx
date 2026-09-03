"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaLinkedinIn,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
  /** "inline" is a horizontal row of labelled buttons; "rail" is icon-only for the sticky desktop gutter. */
  variant?: "inline" | "rail";
}

/**
 * WhatsApp, Facebook and Telegram sit alongside X/LinkedIn because
 * siteConfig.location is Dhaka, Bangladesh, where those channels carry far
 * more link-sharing traffic than X/LinkedIn alone.
 */
function shareLinks(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return [
    {
      name: "X",
      Icon: FaXTwitter,
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      Icon: FaFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      Icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Telegram",
      Icon: FaTelegram,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      Icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];
}

export function ShareButtons({ url, title, variant = "inline" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  // Computed after mount, not during render: the server has no navigator, so
  // deriving this during render would desync the button list on hydration,
  // the same reason Header.tsx reads window.location.hash in an effect.
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const links = shareLinks(url, title);

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // Cancelled by the user, or unsupported despite the feature check --
      // the explicit links below still work either way.
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied -- the address bar is the fallback.
    }
  };

  if (variant === "rail") {
    return (
      <div className="flex flex-col items-center gap-3">
        {canNativeShare ? (
          <button
            type="button"
            onClick={handleNativeShare}
            aria-label="Share"
            className="rounded-full border p-2.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            <Share2 size={16} />
          </button>
        ) : null}
        {links.map(({ name, Icon, href }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${name}`}
            className="rounded-full border p-2.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            <Icon size={16} />
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link"
          className="rounded-full border p-2.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canNativeShare ? (
        <Button variant="outline" size="sm" onClick={handleNativeShare} className="min-h-11 gap-2">
          <Share2 size={16} /> Share
        </Button>
      ) : null}
      {links.map(({ name, Icon, href }) => (
        <Button key={name} variant="outline" size="sm" asChild className="min-h-11 gap-2">
          <a href={href} target="_blank" rel="noopener noreferrer">
            <Icon size={16} /> {name}
          </a>
        </Button>
      ))}
      <Button variant="outline" size="sm" onClick={handleCopy} className="min-h-11 gap-2">
        {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  );
}

export default ShareButtons;
