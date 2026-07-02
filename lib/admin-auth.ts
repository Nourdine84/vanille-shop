export function isAdminRequest(req: Request): boolean {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes("admin=true");
}

export function unauthorizedResponse() {
  return Response.json(
    { error: "Accès admin refusé" },
    { status: 401 }
  );
}
