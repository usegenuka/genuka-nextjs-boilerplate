import { cookies } from "next/headers";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { CompanyDBService } from "@/services/database/company.service";
import { env } from "@/config/env";

const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE = 60 * 60 * 7; // 7 hours

interface SessionPayload extends JWTPayload {
  companyId: string;
}

export async function createSession(companyId: string) {
  const secret = new TextEncoder().encode(env.genuka.clientSecret);

  const token = await new SignJWT({ companyId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7h")
    .sign(secret);

  const cookieStore = await cookies();
  const isProd = env.app.env === "production";

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return token;
}

export async function verifyJwt(token: string): Promise<SessionPayload | null> {
  try {
    const secret = new TextEncoder().encode(env.genuka.clientSecret);
    const { payload } = await jwtVerify(token, secret);
    // console.log("payload", payload);
    return payload as SessionPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function getAuthenticatedCompany() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyJwt(token);

  if (!payload) {
    return null;
  }

  const companyService = new CompanyDBService();
  return await companyService.findByCompanyId(payload.companyId);
}

export async function isAuthenticated(): Promise<boolean> {
  const company = await getAuthenticatedCompany();
  return company !== null;
}

export async function requireAuth() {
  const company = await getAuthenticatedCompany();

  if (!company) {
    throw new Error("Unauthorized");
  }

  return company;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
