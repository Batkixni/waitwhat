import type { APIRoute } from 'astro';
import config from '../../utils/config';

let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

export const GET: APIRoute = async () => {
  const now = Date.now();
  
  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return new Response(JSON.stringify(cache.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(
      `https://api.mcsrvstat.us/3/${config.server.ip}:${config.server.port}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    cache = { data, timestamp: now };
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    const fallback = {
      online: false,
      ip: config.server.ip,
      port: config.server.port,
      players: { online: 0, max: 0 }
    };
    
    return new Response(JSON.stringify(fallback), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
