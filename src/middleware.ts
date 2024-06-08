// middleware.ts
import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateRequest } from "./lib/auth/validate-request";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // const { user } = await validateRequest();
  if (request.method === "GET") {
    return NextResponse.next();
  }
  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");
  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)"],
};
