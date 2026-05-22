import React from 'react';
import { Metadata } from 'next';

// Configuración de renderizado estático estricto para Vercel
export const dynamic = 'force-dynamic';
export const dynamicParams = false;
export const revalidate = false;

type Props = {
  params: Promise<{ slug: string }>; // En Next.js 15/16 'params' es estrictamente una Promesa
};

// Mapeo limpio para evitar cascadas de "if"
const CATEGORIAS_MAP: Record<string, string> = {
  boda: 'packs para bodas.',
  book: 'packs para books.',
  cumple: 'packs para fiestas.',
  locacion: 'locaciones.',
  look: 'looks.',
};

const PAGINAS_MAP: Record<string, number> = {
  boda: 6,
  book: 3,
  cumple: 5,
  locacion: 9,
  look: 6,
};

// 1. GENERACIÓN DE METADATA (Optimizada para el Parser de WhatsApp)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const urlFinal = `https://visor-catalogos.vercel.app/ver/${slug || ''}`;
  
  // URL limpia sin queries raros que confundan la extensión final del archivo
  const imageUrl = 'https://res.cloudinary.com/dyddy7avc/image/upload/v1778962076/Logo_web_3_opengraph-image_r1nkts.png';

  const categoria = slug && CATEGORIAS_MAP[slug] ? CATEGORIAS_MAP[slug] : 'Fotos y Videos';

  console.log("========================================");
  console.log(`🤖 [META DEBUG] Procesando para WhatsApp: "${slug}"`);
  console.log("========================================");

  return {
    title: `Catálogo de ${categoria} - Look Photo & Film`,
    description: `Mirá el catálogo en línea o descargalo para ver sin conexión.`,
    openGraph: {
      title: `Catálogo de ${categoria} - Look Photo & Film`,
      description: `Mirá el catálogo en línea o descargalo para ver sin conexión.`,
      url: urlFinal,
      siteName: 'Look Photo & Film',
      locale: 'es_ES', // Estándar más compatible
      type: 'website',
      // Enviamos tanto el string directo (para WhatsApp) como el objeto estructurado
      images: [imageUrl], 
    },
    twitter: {
      card: 'summary_large_image',
      title: `Catálogo de ${categoria} - Look Photo & Film`,
      description: `Mirá el catálogo en línea o descargalo para ver sin conexión.`,
      images: [imageUrl],
    },
    alternates: {
      canonical: urlFinal,
    }
  };
}


// 2. RUTAS ESTÁTICAS
export async function generateStaticParams() {
  return Object.keys(CATEGORIAS_MAP).map((slug) => ({ slug }));
}

// 3. COMPONENTE PRINCIPAL
export default async function VisorPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Blindaje usando el mapa de categorías válidas
  if (!slug || !CATEGORIAS_MAP[slug]) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        Catálogo no encontrado.
      </div>
    );
  }

  const totalPaginas = PAGINAS_MAP[slug] || 6; 
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
  const pdfPath = `/catalogos/${slug}/${slug}.pdf`;

  return (
    <main className="flex min-h-screen bg-black text-zinc-400 select-none">
      {/* Barra Lateral Izquierda - Oculta scrollbar con Tailwind nativo */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-32 bg-zinc-900/40 backdrop-blur-md border-r border-zinc-800/60 flex flex-col items-center py-6 gap-4 z-50 overflow-y-auto overflow-x-hidden scrollbar-none">
        <div className="mb-4 opacity-30 text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
          </svg>
        </div>
        
        {paginas.map((num) => (
          <a 
            key={`thumb-${num}`} 
            href={`#hoja-${num}`}
            className="relative w-12 md:w-20 aspect-[3/4] bg-zinc-950 rounded-sm overflow-hidden border border-white/5 hover:ring-1 ring-white/40 transition-all group"
          >
            <span className="absolute top-1 left-1 text-[8px] z-10 font-mono bg-black/70 px-1 rounded text-white/80">
              {num}
            </span>
            <img
              src={`/catalogos/${slug}/${num}.jpg`}
              alt={`Miniatura ${num}`}
              className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          </a>
        ))}
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 ml-20 md:ml-32">
        <nav className="sticky top-0 z-40 p-4 bg-black/75 backdrop-blur-md border-b border-zinc-900 flex justify-between items-center px-6 md:px-10">
          <div className="flex flex-col">
            <span className="font-bold tracking-[0.4em] text-[9px] md:text-[10px] uppercase text-white/90">
              LOOK PHOTO & FILM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href={pdfPath}
              download={`${slug}-catalogo.pdf`}
              className="hidden sm:flex items-center gap-2 text-[9px] text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-full transition uppercase tracking-widest"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              PDF
            </a>

            <a 
              href="https://wa.me/+5491144139212" // ⚠️ Recuerda poner el formato internacional sin el + ni espacios
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] tracking-widest bg-white text-black px-5 py-2 rounded-full font-bold uppercase hover:bg-zinc-200 transition"
            >
              CONSULTAR FECHA
            </a>
          </div>
        </nav>

        <section className="flex flex-col items-center py-12 gap-16 md:gap-24 px-4 md:px-10">
          {paginas.map((num) => (
            <div 
              key={num} 
              id={`hoja-${num}`} 
              className="relative w-full max-w-3xl scroll-mt-24"
            >
              <div className="mb-3 flex items-center justify-between opacity-30 uppercase tracking-[0.2em] text-[8px] md:text-[9px]">
                <span>Página {num}</span>
                <span className="h-[1px] flex-1 mx-4 bg-zinc-900"></span>
                <span className="tracking-widest font-mono">{slug}</span>
              </div>

              <div className="bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden border border-white/5">
                <img
                  src={`/catalogos/${slug}/${num}.jpg`}
                  alt={`Catálogo ${slug} - Página ${num}`}
                  className="w-full h-auto select-none pointer-events-none"
                  style={{ maxHeight: '82vh', objectFit: 'contain' }}
                  loading={num <= 2 ? "eager" : "lazy"}
                  decoding={num <= 2 ? "sync" : "async"}
                />
              </div>
            </div>
          ))}

          {/* Bloque de descarga final */}
          <div className="py-14 flex flex-col items-center gap-5 border-t border-zinc-900 w-full max-w-xl">
            <p className="text-zinc-600 text-[9px] tracking-[0.2em] uppercase">¿Prefieres leerlo sin conexión?</p>
            <a 
              href={pdfPath}
              download={`${slug}-catalogo.pdf`}
              className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 text-zinc-300 px-8 py-3.5 rounded-sm hover:bg-zinc-900 hover:text-white transition text-[10px] tracking-[0.2em] uppercase font-bold"
            >
              Descargar Catálogo Completo (PDF)
            </a>
          </div>
        </section>

        <footer className="p-16 text-center text-zinc-700 text-[8px] tracking-[0.4em] uppercase border-t border-zinc-950">
          © {new Date().getFullYear()} LOOK PHOTO & FILM • DOCUMENTARY WEDDING & PORTRAITS
        </footer>
      </div>
    </main>
  );
}