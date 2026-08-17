import type { APIRoute } from 'astro';
import { enregistrerContact } from '../../lib/brevo';
import { limiteAtteinte, ressembleAUnRobot, schemaLead } from '../../lib/validate';

export const prerender = false;

function json(corps: Record<string, unknown>, statut = 200): Response {
  return new Response(JSON.stringify(corps), {
    status: statut,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const maintenant = Date.now();

  let brut: unknown;
  try {
    brut = await request.json();
  } catch {
    return json({ ok: false, message: "L’envoi n’a pas abouti." }, 400);
  }

  const resultat = schemaLead.safeParse(brut);
  if (!resultat.success) {
    const premier = resultat.error.issues[0];
    return json(
      {
        ok: false,
        champ: premier?.path[0] ?? null,
        message: premier?.message ?? "L’envoi n’a pas abouti.",
      },
      400
    );
  }

  const lead = resultat.data;

  // Piège à robots : on répond 200 pour ne pas les renseigner.
  if (ressembleAUnRobot(lead, maintenant)) {
    return json({ ok: true });
  }

  if (limiteAtteinte(clientAddress ?? 'inconnue', maintenant)) {
    return json(
      { ok: false, message: "Trop de tentatives. Réessayez dans quelques minutes." },
      429
    );
  }

  const enregistre = await enregistrerContact({
    email: lead.email,
    prenom: lead.prenom,
    profession: lead.profession,
  });

  if (!enregistre) {
    return json(
      { ok: false, message: "L’envoi n’a pas abouti. Réessayez dans un instant." },
      502
    );
  }

  return json({ ok: true });
};

/** Toute autre méthode est refusée explicitement. */
export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { allow: 'POST' } });
