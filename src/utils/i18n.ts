import type { AstroCookies } from 'astro';
import config from './config';

const localeCache: Record<string, any> = {};

export async function loadLocale(locale: string): Promise<any> {
  if (localeCache[locale]) return localeCache[locale];
  
  try {
    const mod = await import(`../../config/locales/${locale}.json`);
    localeCache[locale] = mod.default || mod;
    return localeCache[locale];
  } catch {
    const fallback = await import(`../../config/locales/${config.locale.default}.json`);
    localeCache[config.locale.default] = fallback.default || fallback;
    return localeCache[config.locale.default];
  }
}

export function detectLocale(cookies: AstroCookies, requestHeaders: Headers, url?: URL): string {
  // 1. Check query string ?lang=
  if (url) {
    const queryLang = url.searchParams.get('lang');
    if (queryLang && config.locale.available.includes(queryLang)) {
      return queryLang;
    }
  }

  // 2. Check cookie
  const cookieLang = cookies.get('lang')?.value;
  if (cookieLang && config.locale.available.includes(cookieLang)) {
    return cookieLang;
  }

  // 3. Check Accept-Language header
  const acceptLang = requestHeaders.get('accept-language');
  if (acceptLang) {
    const preferred = acceptLang.split(',')[0]?.trim().toLowerCase();
    if (preferred) {
      const mapped = preferred.replace('_', '-');
      if (config.locale.available.includes(mapped)) return mapped;
      
      const short = mapped.split('-')[0];
      const match = config.locale.available.find(l => l.startsWith(short));
      if (match) return match;
    }
  }

  return config.locale.default;
}

export function t(localeData: any, key: string, replacements?: Record<string, string>): string {
  const keys = key.split('.');
  let value = localeData;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }

  if (typeof value !== 'string') return key;

  if (replacements) {
    return value.replace(/\{(\w+)\}/g, (_, name) => replacements[name] ?? `{${name}}`);
  }

  return value;
}

export function tArray(localeData: any, key: string): any[] {
  const keys = key.split('.');
  let value = localeData;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return [];
    }
  }

  return Array.isArray(value) ? value : [];
}

export const currencyFlags: Record<string, string> = {
  'USD': '/flags/us.svg',
  'TWD': '/flags/tw.svg',
  'EUR': '/flags/eu.svg',
  'GBP': '/flags/gb.svg',
  'JPY': '/flags/jp.svg',
  'KRW': '/flags/kr.svg'
};

export const localeFlags: Record<string, string> = {
  'en': '/flags/us.svg',
  'zh-tw': '/flags/tw.svg',
  'zh-cn': '/flags/cn.svg',
  'ja': '/flags/jp.svg',
  'ko': '/flags/kr.svg',
  'de': '/flags/de.svg',
  'fr': '/flags/fr.svg',
  'es': '/flags/es.svg'
};

export const localeNames: Record<string, string> = {
  'en': 'English',
  'zh-tw': '繁體中文',
  'zh-cn': '简体中文',
  'ja': '日本語',
  'ko': '한국어',
  'de': 'Deutsch',
  'fr': 'Français',
  'es': 'Español'
};

export const currencySymbols: Record<string, string> = {
  'USD': 'US$',
  'TWD': 'NT$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'KRW': '₩'
};
