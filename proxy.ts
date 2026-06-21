import { NextRequest, NextResponse } from "next/server";
import setCookieParser from "set-cookie-parser";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!accessToken) {
    if (refreshToken) {
      const data = await checkSession();
      const setCookie = data.headers["set-cookie"];

      if (setCookie) {
        let response: NextResponse;
        if (isPublicRoute) {
          response = NextResponse.redirect(new URL("/", request.url));
        } else {
          response = NextResponse.next();
        }

        const splitCookies = setCookieParser.splitCookiesString(setCookie);
        const parsedCookies = setCookieParser.parse(splitCookies);

        for (const cookie of parsedCookies) {
          if (cookie.name === "accessToken" || cookie.name === "refreshToken") {
            let sameSite: "lax" | "strict" | "none" | boolean | undefined =
              undefined;
            if (cookie.sameSite) {
              const lowerSameSite = cookie.sameSite.toLowerCase();
              if (
                lowerSameSite === "lax" ||
                lowerSameSite === "strict" ||
                lowerSameSite === "none"
              ) {
                sameSite = lowerSameSite;
              }
            }

            const options = {
              path: cookie.path,
              domain: cookie.domain,
              expires: cookie.expires,
              maxAge: cookie.maxAge,
              secure: cookie.secure,
              httpOnly: cookie.httpOnly,
              sameSite,
            };

            response.cookies.set(cookie.name, cookie.value, options);
          }
        }

        return response;
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (isPrivateRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
