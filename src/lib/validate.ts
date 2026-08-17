import { z } from 'zod';
import { professions } from '../data/site';

const valeursProfession = professions.map((p) => p.valeur) as [string, ...string[]];

/**
 * Minimisation stricte : prénom, e-mail, profession. Rien d’autre.
 * Le téléphone est demandé plus tard, au moment de la prise de rendez-vous,
 * où il est légitime : la prestation est un appel.
 */
export const schemaLead = z.object({
  prenom: z
    .string()
    .trim()
    .min(2, 'Ce champ est nécessaire pour vous envoyer le guide.')
    .max(60),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(180)
    .pipe(z.email('Cette adresse e-mail semble incomplète.')),
  profession: z.enum(valeursProfession, {
    error: 'Choisissez une profession dans la liste.',
  }),
  consentement: z.literal(true, {
    error: 'Votre accord est nécessaire pour vous envoyer le guide.',
  }),
  /**
   * Honeypot. Volontairement accepté par le schéma : s'il était rejeté ici,
   * la réponse d'erreur indiquerait au robot quel champ le trahit. Le tri se
   * fait plus loin, dans `ressembleAUnRobot`, qui répond 200 sans rien
   * enregistrer.
   */
  societe: z.string().max(200).optional(),
  /** Horodatage du rendu de la page, en millisecondes. */
  rendu: z.coerce.number().int().nonnegative().optional(),
});

export type Lead = z.infer<typeof schemaLead>;

/**
 * Demande de rappel : l'alternative native à l'agenda en ligne.
 *
 * Plus de champs que le formulaire guide, et c'est justifié : la prestation
 * demandée est un appel téléphonique. Le téléphone est ici légitime, ce
 * qu'il n'est pas sur le lead magnet (cf. spec/09-tracking-rgpd.md).
 */
export const schemaRdv = z.object({
  nom: z
    .string()
    .trim()
    .min(2, 'Indiquez votre prénom et votre nom.')
    .max(80),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(180)
    .pipe(z.email('Cette adresse e-mail semble incomplète.')),
  telephone: z
    .string()
    .trim()
    .min(9, 'Ce numéro semble incomplet.')
    .max(20)
    .regex(
      /^[+0-9 ().-]+$/,
      'Un numéro de téléphone ne contient que des chiffres.'
    ),
  profession: z.enum(valeursProfession, {
    error: 'Choisissez une profession dans la liste.',
  }),
  disponibilites: z.enum(['matin', 'apres-midi', 'soiree', 'indifferent'], {
    error: 'Indiquez quand vous joindre.',
  }),
  /**
   * Documente que l'information tarifaire a été portée à connaissance avant
   * l'appel, utile en cas de contestation (spec/09 §Prise de rendez-vous).
   */
  tarifLu: z.enum(['oui', 'non'], {
    error: 'Répondez par oui ou par non.',
  }),
  message: z.string().trim().max(600).optional().or(z.literal('')),
  consentement: z.literal(true, {
    error: 'Votre accord est nécessaire pour que nous vous rappelions.',
  }),
  societe: z.string().max(200).optional(),
  rendu: z.coerce.number().int().nonnegative().optional(),
});

export type DemandeRdv = z.infer<typeof schemaRdv>;

export const LIBELLES_DISPONIBILITE: Record<
  DemandeRdv['disponibilites'],
  string
> = {
  matin: 'Le matin',
  'apres-midi': 'L’après-midi',
  soiree: 'En soirée',
  indifferent: 'Indifférent',
};

/** Délai minimal entre l’affichage du formulaire et sa soumission. */
export const DELAI_MINIMAL_MS = 2000;

export function ressembleAUnRobot(
  soumission: { societe?: string; rendu?: number },
  maintenant: number
): boolean {
  if (soumission.societe) return true;
  if (typeof soumission.rendu !== 'number') return false;
  return maintenant - soumission.rendu < DELAI_MINIMAL_MS;
}

/**
 * Limitation de débit en mémoire. Suffisant pour un formulaire à faible
 * volume sur une instance ; à remplacer par un stockage partagé si le site
 * passe sur plusieurs instances.
 */
const FENETRE_MS = 10 * 60 * 1000;
const MAX_PAR_FENETRE = 5;
const compteurs = new Map<string, { total: number; debut: number }>();

export function limiteAtteinte(cle: string, maintenant: number): boolean {
  const entree = compteurs.get(cle);

  if (!entree || maintenant - entree.debut > FENETRE_MS) {
    compteurs.set(cle, { total: 1, debut: maintenant });
    return false;
  }

  entree.total += 1;

  // Purge opportuniste : la Map ne doit pas croître indéfiniment.
  if (compteurs.size > 5000) {
    for (const [autreCle, valeur] of compteurs) {
      if (maintenant - valeur.debut > FENETRE_MS) compteurs.delete(autreCle);
    }
  }

  return entree.total > MAX_PAR_FENETRE;
}
