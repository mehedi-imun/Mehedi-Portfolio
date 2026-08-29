import { siteConfig } from "./site";

/**
 * Language helpers for per-post content language.
 *
 * A post declares a free BCP-47 string (`lang: "bn"`, `lang: "en-GB"`). The site
 * chrome stays English; only the article varies. There is no translation
 * pairing, no hreflang and no locale-prefixed routing.
 */

/** Scripts written right-to-left. Cheap to support now, expensive to retrofit. */
const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur"]);

/** OpenGraph wants `language_TERRITORY`, which a bare BCP-47 tag does not give. */
const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  bn: "bn_BD",
};

/** The primary subtag, lowercased: "bn-BD" -> "bn". */
function primarySubtag(lang: string): string {
  return lang.split("-")[0].toLowerCase();
}

export function isRtl(lang: string): boolean {
  return RTL_LANGUAGES.has(primarySubtag(lang));
}

export function dirFor(lang: string): "ltr" | "rtl" {
  return isRtl(lang) ? "rtl" : "ltr";
}

/**
 * Uses the explicit region when the post supplies one ("bn-BD" -> "bn_BD"),
 * otherwise a known default. Unknown languages fall back to the site locale
 * rather than inventing a territory, since "bn_BN" would be meaningless.
 */
export function ogLocaleFor(lang: string): string {
  const [primary, region] = lang.split("-");
  if (region) return `${primary.toLowerCase()}_${region.toUpperCase()}`;
  return OG_LOCALES[primarySubtag(lang)] ?? siteConfig.locale;
}
