import type { APIRoute } from 'astro';
import { enregistrerContact } from '../../lib/brevo';
import {
  LIBELLES_DISPONIBILITE,
  limiteAtteinte,
  ressembleAUnRobot,
  schemaRdv,
} from '../../lib/validate';

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
    return json({ ok: false, message: 'L’envoi n’a pas abouti.' }, 400);
  }

  const resultat = schemaRdv.safeParse(brut);
  if (!resultat.success) {
    const premier = resultat.error.issues[0];
    return json(
      {
        ok: false,
        champ: premier?.path[0] ?? null,
        message: premier?.message ?? 'L’envoi n’a pas abouti.',
      },
      400
    );
  }

  const demande = resultat.data;

  // Piège à robots : on répond 200 pour ne pas les renseigner.
  if (ressembleAUnRobot(demande, maintenant)) {
    return json({ ok: true });
  }

  if (limiteAtteinte(`rdv:${clientAddress ?? 'inconnue'}`, maintenant)) {
    return json(
      { ok: false, message: 'Trop de tentatives. Réessayez dans quelques minutes.' },
      429
    );
  }

  const [prenom, ...reste] = demande.nom.split(/\s+/);

  const enregistre = await enregistrerContact(
    {
      email: demande.email,
      prenom: prenom ?? demande.nom,
      profession: demande.profession,
      attributs: {
        NOM: reste.join(' '),
        SMS: demande.telephone,
        DISPONIBILITES: LIBELLES_DISPONIBILITE[demande.disponibilites],
        TARIF_LU: demande.tarifLu === 'oui' ? 'Oui' : 'Non',
        ...(demande.message ? { MESSAGE: demande.message } : {}),
      },
    },
    'rdv'
  );

  if (!enregistre) {
    return json(
      { ok: false, message: 'L’envoi n’a pas abouti. Réessayez dans un instant.' },
      502
    );
  }

  return json({ ok: true });
};

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { allow: 'POST' } });
