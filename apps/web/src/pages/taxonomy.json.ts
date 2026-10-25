import type { APIRoute } from 'astro';
import { taxonomy } from '../lib/data';

// The whole taxonomy (metadata, styles and rubric) for anyone who wants to reuse it.
export const GET: APIRoute = () =>
  new Response(JSON.stringify(taxonomy, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
