import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { jsonError } from "@/lib/api/admin-route";
import {
  createAdminSessionCookie,
  sessionCookieOptions,
} from "@/lib/firebase/session";

const bodySchema = z.object({
  idToken: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const sessionCookie = await createAdminSessionCookie(body.idToken);
    const opts = sessionCookieOptions();
    const cookieStore = await cookies();
    cookieStore.set(opts.name, sessionCookie, {
      httpOnly: opts.httpOnly,
      secure: opts.secure,
      sameSite: opts.sameSite,
      path: opts.path,
      maxAge: opts.maxAge,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "FORBIDDEN") {
      return jsonError("This account is not authorized for admin access.", 403);
    }
    return jsonError("Invalid credentials or session.", 401);
  }
}
