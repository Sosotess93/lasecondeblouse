import { professions } from '../data/site';

const API = 'https://api.brevo.com/v3';

export type ListeBrevo = 'guide' | 'rdv';

export interface ContactBrevo {
  email: string;
  prenom: string;
  profession: string;
  /** Attributs supplémentaires, déjà nommés comme dans Brevo. */
  attributs?: Record<string, string>;
}

function libelleProfession(valeur: string): string {
  return professions.find((p) => p.valeur === valeur)?.label ?? valeur;
}

function identifiantListe(liste: ListeBrevo): number | null {
  const brut =
    liste === 'rdv'
      ? (import.meta.env.BREVO_LIST_RDV_ID ?? import.meta.env.BREVO_LIST_ID)
      : import.meta.env.BREVO_LIST_ID;

  const identifiant = Number(brut);
  return Number.isInteger(identifiant) && identifiant > 0 ? identifiant : null;
}

/**
 * Crée ou met à jour le contact et l'ajoute à la liste demandée.
 *
 * Ne jamais laisser remonter le détail des erreurs Brevo jusqu'au client :
 * elles exposent la configuration du compte. On journalise sans l'e-mail
 * en clair (cf. spec/09-tracking-rgpd.md).
 */
export async function enregistrerContact(
  contact: ContactBrevo,
  liste: ListeBrevo = 'guide'
): Promise<boolean> {
  const cle = import.meta.env.BREVO_API_KEY;
  const identifiant = identifiantListe(liste);

  if (!cle) {
    console.error('[brevo] BREVO_API_KEY absente de la configuration.');
    return false;
  }

  if (identifiant === null) {
    console.error(`[brevo] Identifiant de liste « ${liste} » absent ou invalide.`);
    return false;
  }

  const enTetes = {
    'api-key': cle,
    'content-type': 'application/json',
    accept: 'application/json',
  };

  try {
    const reponse = await fetch(`${API}/contacts`, {
      method: 'POST',
      headers: enTetes,
      body: JSON.stringify({
        email: contact.email,
        updateEnabled: true,
        attributes: {
          PRENOM: contact.prenom,
          PROFESSION: libelleProfession(contact.profession),
          ...contact.attributs,
        },
        listIds: [identifiant],
      }),
    });

    if (reponse.ok) return true;

    // 400 « Contact already exist » : on rattache simplement à la liste.
    if (reponse.status === 400) {
      const rattachement = await fetch(
        `${API}/contacts/lists/${identifiant}/contacts/add`,
        {
          method: 'POST',
          headers: enTetes,
          body: JSON.stringify({ emails: [contact.email] }),
        }
      );
      if (rattachement.ok) return true;
      console.error('[brevo] Rattachement à la liste refusé', rattachement.status);
      return false;
    }

    console.error('[brevo] Création de contact refusée', reponse.status);
    return false;
  } catch (erreur) {
    console.error(
      '[brevo] Brevo injoignable',
      erreur instanceof Error ? erreur.message : ''
    );
    return false;
  }
}
