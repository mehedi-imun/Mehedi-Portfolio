import { ImageResponse } from "next/og";

// iOS home-screen icons must be PNG, so the monogram from icon.svg is rasterised
// here. The path is inlined rather than set as text because the default font in
// ImageResponse ships only a regular weight, which rendered the M too thin.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Square and full-bleed: iOS applies its own rounded mask on top.
const monogram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="180" height="180">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff914d"/>
      <stop offset="1" stop-color="#fb923c"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" fill="url(#brand)"/>
  <path fill="#0a0a0a" d="M7 24V8h4.5L16 16.5 20.5 8H25v16h-3.8V14.2L17.6 21h-3.2l-3.6-6.8V24z"/>
</svg>`;

export default function AppleIcon() {
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(monogram).toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUri} width={size.width} height={size.height} alt="" />
      </div>
    ),
    size
  );
}
