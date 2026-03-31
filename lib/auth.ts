import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "vanille_or_user";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
}

export function setUserSession(userId: string) {
  cookies().set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearUserSession() {
  cookies().delete(SESSION_COOKIE);
}
