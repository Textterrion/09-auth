import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none" | boolean;
}

interface ParsedCookie {
  name: string;
  value: string;
  options: CookieOptions;
}

function parseSetCookie(cookieStr: string): ParsedCookie | null {
  const parts = cookieStr.split(";").map((p) => p.trim());
  const nameValue = parts[0];
  if (!nameValue) return null;

  const eqIdx = nameValue.indexOf("=");
  if (eqIdx === -1) return null;

  const name = nameValue.substring(0, eqIdx);
  const value = nameValue.substring(eqIdx + 1);

  const options: CookieOptions = {};

  for (let i = 1; i < parts.length; i++) {
    const [key, ...valParts] = parts[i].split("=");
    const lowerKey = key.toLowerCase();
    const val = valParts.join("=");

    if (lowerKey === "expires") {
      options.expires = new Date(val);
    } else if (lowerKey === "max-age") {
      options.maxAge = Number(val);
    } else if (lowerKey === "path") {
      options.path = val;
    } else if (lowerKey === "httponly") {
      options.httpOnly = true;
    } else if (lowerKey === "secure") {
      options.secure = true;
    } else if (lowerKey === "samesite") {
      const lowerVal = val.toLowerCase();
      if (lowerVal === "lax" || lowerVal === "strict" || lowerVal === "none") {
        options.sameSite = lowerVal;
      } else {
        options.sameSite = lowerVal === "true";
      }
    }
  }

  return { name, value, options };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

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
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);
          if (!parsed) continue;

          if (parsed.name === "accessToken" || parsed.name === "refreshToken") {
            cookieStore.set(parsed.name, parsed.value, parsed.options);
          }
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL("/", request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
        if (isPrivateRoute) {
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
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
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
