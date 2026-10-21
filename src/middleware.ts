import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const t = req.cookies.get("shopco_session")?.value;
  const login = new URL(`/login?next=${encodeURIComponent(req.nextUrl.pathname)}`, req.url);
  if (!t) return NextResponse.redirect(login);
  try {
    const { payload } = await jwtVerify(t, new TextEncoder().encode(process.env.JWT_SECRET || "dev-only-secret-change-me-please-32chars"));
    if (payload.role === "admin" && payload.mfa !== true) return NextResponse.redirect(login);
    if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "admin") return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  } catch { return NextResponse.redirect(login); }
}
export const config = { matcher: ["/admin/:path*", "/checkout/:path*", "/order/:path*"] };
