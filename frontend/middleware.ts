import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const publicPaths = [
    "/login",
    "/api/auth/login",
    "/_next", // ✅ needed for compiled assets
    "/favicon.ico", // ✅ browser icon
    "/styles", // ✅ global.css (if imported as static)
    "/fonts", // ✅ if you use custom fonts
    "/images", // ✅ optional: public images
  ];

  const isPublic = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  const isApi = req.nextUrl.pathname.startsWith("/api"); // add this
  const isBackend = req.nextUrl.pathname.startsWith("/auth"); // add this too

  if (isPublic || isApi || isBackend) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
