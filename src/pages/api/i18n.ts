import type { APIRoute } from 'astro';
import { detectLocale, loadLocale } from '../../utils/i18n';

export const GET: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url);
  const requestedLang = url.searchParams.get('lang');
  
  let locale: string;
  if (requestedLang) {
    locale = requestedLang;
  } else {
    locale = detectLocale(cookies, request.headers, new URL(request.url));
  }
  
  try {
    const data = await loadLocale(locale);
    return new Response(JSON.stringify({ locale, data }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Locale not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
