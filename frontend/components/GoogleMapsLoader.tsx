"use client";
import Script from "next/script";

export default function GoogleMapsLoader() {
  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
      strategy="afterInteractive"
      onLoad={() => console.log("✅ Google Maps script loaded")}
      onError={() => console.error("❌ Google Maps script failed to load")}
    />
  );
}
