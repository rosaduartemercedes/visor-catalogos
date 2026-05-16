/*import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // Si el que entra es el robot de Meta, le metemos headers para limpiar el camino
  if (userAgent.includes('facebookexternalhit') || userAgent.includes('Facebot')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  return NextResponse.next();
}

// Solo aplicamos este intermediario a las rutas de los catálogos
export const config = {
  matcher: '/ver/:path*',
};*/