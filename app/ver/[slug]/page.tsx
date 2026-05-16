// app/ver/[slug]/page.tsx
import React from 'react';
import { Metadata } from 'next'; // 1. Importamos el tipo Metadata

type Props = {
  params: Promise<{ slug: string }>;
};


// 2. FUNCIÓN PARA GENERAR LA TARJETA DINÁMICA DE INSTAGRAM
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // Maquillamos un poco el nombre para el título (boda -> Bodas, cumple -> Cumpleaños, book -> Books)
  let categoria = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  
  if (slug === 'boda') categoria = 'packs para bodas.';
  if (slug === 'book') categoria = 'packs para books.';
  if (slug === 'cumple') categoria = 'packs para fiestas.'; // <--- Modificá acá lo que quieras mostrar
  if (slug === 'locacion') categoria = 'locaciones.';
  if (slug === 'look') categoria = 'looks.';
  

  return {
    
    openGraph: {
      title: `Catálogo de ${categoria}`,
      description: `Mirá el catalogo en línea o descargalo para ver sin conexión`,
      url: `https://visor-catalogos.vercel.app/ver/${slug}`,
      siteName: 'Look Photo & Film',
      locale: 'es_AR',
      type: 'website',
    },
  };
}


export default async function VisorPage({ params }: Props) {
  // slug será "boda", "books" o "cumple" según la URL
  const { slug } = await params;

  

  // Definimos dinámicamente cuántas páginas tiene cada catálogo
  // Si agregas otro catálogo en el futuro, solo sumas una línea aquí
  let totalPaginas = 6; 
  if (slug === 'cumple') totalPaginas = 4; // Ajusta según corresponda
  if (slug === 'book') totalPaginas = 3; 
  if (slug === 'boda') totalPaginas = 6; 
  if (slug === 'locacion') totalPaginas = 9; 
  if (slug === 'look') totalPaginas = 6; 
  
  // Genera el array dinámicamente [1, 2, 3, ...] basado en las páginas que correspondan
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  // La ruta del PDF y las imágenes se adaptan solas
  const pdfPath = `/catalogos/${slug}/${slug}.pdf`;

  return (
    <main className="flex min-h-screen bg-black text-zinc-400">
      
      {/* 1. BARRA LATERAL IZQUIERDA (Miniaturas Dinámicas) */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-32 bg-zinc-900/50 backdrop-blur-md border-r border-zinc-800 flex flex-col items-center py-6 gap-4 z-50 overflow-y-auto no-scrollbar">
        <div className="mb-4 opacity-50 text-white">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
           </svg>
        </div>
        
        {paginas.map((num) => (
          <a 
            key={`thumb-${num}`} 
            href={`#hoja-${num}`}
            className="relative w-12 md:w-20 aspect-[3/4] bg-zinc-800 rounded-sm overflow-hidden hover:ring-2 ring-white/50 transition-all group"
          >
            <span className="absolute top-1 left-1 text-[8px] z-10 font-bold bg-black/50 px-1 rounded text-white">
              {num}
            </span>
            <img
              src={`/catalogos/${slug}/${num}.jpg`}
              alt={`Miniatura ${num}`}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
            />
          </a>
        ))}
      </aside>

      {/* 2. CONTENIDO PRINCIPAL (Visor) */}
      <div className="flex-1 ml-20 md:ml-32">
        
        {/* Nav Superior */}
        <nav className="sticky top-0 z-40 p-4 bg-black/80 backdrop-blur-md border-b border-zinc-800 flex justify-between items-center px-8">
          <div className="flex flex-col">
            <span className="font-bold tracking-[0.3em] text-[10px] uppercase text-white">
              LOOK PHOTO & FILM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href={pdfPath}
              download={`${slug}-catalogo.pdf`}
              className="hidden sm:flex items-center gap-2 text-[9px] text-zinc-400 hover:text-white border border-zinc-700 px-4 py-2 rounded-full transition uppercase tracking-widest"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              PDF
            </a>

            <a 
              href="https://wa.me/TUNUMERO" 
              target="_blank"
              className="text-[9px] bg-white text-black px-4 py-2 rounded-full font-black uppercase hover:bg-zinc-200 transition"
            >
              CONSULTAR FECHA
            </a>
          </div>
        </nav>

        {/* Scroll de imágenes */}
        <section className="flex flex-col items-center py-12 gap-20 px-4 md:px-10">
          {paginas.map((num) => (
            <div 
              key={num} 
              id={`hoja-${num}`} 
              className="relative w-full max-w-3xl scroll-mt-24"
            >
              <div className="mb-4 flex items-center justify-between opacity-40 uppercase tracking-[0.2em] text-[9px]">
                <span>Página {num}</span>
                <span className="h-[1px] flex-1 mx-4 bg-zinc-800"></span>
                <span className="tracking-widest">{slug}</span>
              </div>

              <div className="bg-zinc-950 shadow-2xl rounded-sm overflow-hidden border border-white/5">
                <img
                  src={`/catalogos/${slug}/${num}.jpg`}
                  alt={`Página ${num}`}
                  className="w-full h-auto"
                  style={{ maxHeight: '85vh', objectFit: 'contain' }}
                  loading={num <= 2 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ))}

          {/* BOTÓN FINAL DE DESCARGA */}
          <div className="py-10 flex flex-col items-center gap-6">
            <p className="text-zinc-500 text-[10px] tracking-widest uppercase">¿Prefieres leerlo sin conexión?</p>
            <a 
              href={pdfPath}
              download={`${slug}-catalogo.pdf`}
              className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 text-white px-8 py-4 rounded-sm hover:bg-zinc-800 transition text-xs tracking-[0.2em] uppercase font-bold"
            >
              Descargar Catálogo Completo (PDF)
            </a>
          </div>
        </section>

        <footer className="p-20 text-center text-zinc-700 text-[9px] tracking-[0.5em] uppercase border-t border-zinc-900">
          © {new Date().getFullYear()} LOOK PHOTO & FILM • Portfolio
        </footer>
      </div>
    </main>
  );
}