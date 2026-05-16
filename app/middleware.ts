import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  if (
    userAgent.includes('facebookexternalhit') || 
    userAgent.includes('Facebot') || 
    userAgent.includes('facebookplatform')
  ) {
    // Retornamos un HTML plano inmediato para engañar a Facebook y ver si así entra
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="Catálogo de Boda" />
          <meta property="og:description" content="Mira nuestro catálogo de fotos y videos." />
          <meta property="og:image" content="https://visor-catalogos.vercel.app/tu-imagen-de-prueba.jpg" />
          <meta property="og:type" content="website" />
        </head>
        <body>Prueba Bot Facebook</body>
      </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/ver/:path*',
};