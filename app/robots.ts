// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    // Si tienes sitemap, puedes agregarlo aquí abajo cuando lo crees:
    // sitemap: 'https://visor-catalogos.vercel.app/sitemap.xml',
  }
}