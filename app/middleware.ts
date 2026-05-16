import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // Detectamos los bots de Meta (Facebook, Instagram, WhatsApp)
  if (
    userAgent.includes('facebookexternalhit') || 
    userAgent.includes('Facebot') || 
    userAgent.includes('facebookplatform')
  ) {
    // Creamos la respuesta dándole luz verde
    const response = NextResponse.next();
    
    // Forzamos las políticas de CORS para que Facebook pueda leer el contenido
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Evitamos que Facebook guarde un error viejo en su caché
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  }

  return NextResponse.next();
}

// Se aplica a todas las rutas de los catálogos
export const config = {
  matcher: '/ver/:path*',
};