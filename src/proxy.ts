import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/', '/api/promote', '/blocked(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Se o usuário está logado e tenta acessar Login ou Cadastro, manda pro Dashboard
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  const { sessionClaims } = await auth();
  const claims = sessionClaims as any;
  
  // 🐣 Debug & Fallback de Role via Cookie (Edge Compatible)
  const cookieRole = req.cookies.get('clerk-role')?.value;
  const rawRole = (claims?.role || claims?.publicMetadata?.role || claims?.metadata?.role || cookieRole) as string;
  const role = rawRole?.toUpperCase();
  const isSuperAdmin = role === 'SUPER_ADMIN';
  
  const producerId = claims?.producerId || claims?.publicMetadata?.producerId || claims?.metadata?.producerId;

  // 1. Bloqueio de Admin
  if (isAdminRoute(req) && !isSuperAdmin) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. Injeção de Header
  const requestHeaders = new Headers(req.headers);
  if (producerId) {
    requestHeaders.set("x-producer-id", producerId);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
