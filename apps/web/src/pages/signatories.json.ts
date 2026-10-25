import type { APIRoute } from 'astro';
import { roleCounts, signatories } from '../lib/data';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        count: signatories.length,
        roles: roleCounts(signatories),
        signatories: signatories.map(({ github, name, role, title, company, location, link, signed_at }) => ({
          github,
          name,
          role,
          title,
          company,
          location,
          link,
          signed_at: String(signed_at),
        })),
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
