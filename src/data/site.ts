/**
 * Constantes du site. Aucune de ces valeurs ne doit être écrite en dur
 * dans un composant : elles changeront toutes au moins une fois.
 *
 * Les champs `null` sont des informations à obtenir d’Oumaya (phase 0 du
 * backlog). Le script `scripts/check-copy.mjs` les recense et bloque le
 * build de production tant qu’ils ne sont pas renseignés.
 */

export const site = {
  nom: 'La Seconde Blouse',
  url: 'https://lasecondeblouse.fr', // [À CONFIRMER]
  description:
    'Programme de reconversion professionnelle destiné aux professionnels de santé vers le métier de closeur.',
  langue: 'fr-FR',
} as const;

export const contact = {
  email: 'contact@lasecondeblouse.fr',
  emailDonnees: null as string | null, // [À CONFIRMER] ex: donnees@lasecondeblouse.fr
  /**
   * Numéro provisoire communiqué par Oumaya. L'indicatif +216 est tunisien :
   * à recouper avec le lieu d'établissement de la structure, qui détermine le
   * régime applicable aux mentions légales et à la médiation de la
   * consommation. Suivi dans `editrice.pays`.
   */
  telephone: '+216 26 178 847', // [À CONFIRMER] numéro définitif
  telephoneLien: 'tel:+21626178847',
} as const;

export const editrice = {
  raisonSociale: null as string | null, // [À CONFIRMER]
  formeJuridique: null as string | null, // [À CONFIRMER] SASU / EI / …
  capital: null as string | null, // [À CONFIRMER]
  siren: null as string | null, // [À CONFIRMER]
  adresse: null as string | null, // [À CONFIRMER]
  /**
   * Pays d'établissement. Le numéro de contact est tunisien : ce champ décide
   * du régime applicable aux mentions légales, aux CGV et à l'obligation
   * d'adhérer à un médiateur de la consommation.
   */
  pays: null as string | null, // [À CONFIRMER]
  directricePublication: 'Oumaya', // [À CONFIRMER] nom complet
  /** N° de déclaration d’activité de formation, si déclarée. */
  declarationActivite: null as string | null, // [À CONFIRMER]
  qualiopi: false, // [À CONFIRMER] : si true, réécrire 02-conformite.md §3
  rncp: null as string | null, // [À CONFIRMER]
} as const;

export const hebergeur = {
  nom: 'Vercel Inc.', // [À CONFIRMER] selon l’option de déploiement retenue
  adresse: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
  telephone: null as string | null, // [À CONFIRMER]
} as const;

export const mediateur = {
  nom: null as string | null, // [À CONFIRMER] adhésion obligatoire (art. L616-1)
  url: null as string | null, // [À CONFIRMER]
  adresse: null as string | null, // [À CONFIRMER]
} as const;

/**
 * Tarif. Interdiction absolue de renseigner ici autre chose que le prix
 * réel du programme : c’est la seule valeur en euros autorisée sur le site.
 */
export const tarif = {
  montant: null as number | null, // [À CONFIRMER] en euros TTC
  nombreEcheances: null as number | null, // [À CONFIRMER] : au-delà de 3, valider le cadre crédit conso
  montantParEcheance: null as number | null, // [À CONFIRMER]
} as const;

export const programme = {
  dureeSemaines: null as number | null, // [À CONFIRMER]
  format: null as string | null, // [À CONFIRMER]
  tailleGroupe: null as string | null, // [À CONFIRMER]
  dureeAcces: null as string | null, // [À CONFIRMER]
  heuresParSemaine: null as string | null, // [À CONFIRMER] ex: "3 à 5 heures"
} as const;

export const reseaux = {
  instagram: 'https://www.instagram.com/la.seconde.blouse',
  tiktok: null as string | null, // [À CONFIRMER]
} as const;

/** Durée totale du créneau. Doit égaler la somme des 4 temps de §9. */
export const appel = {
  dureeMinutes: 30,
} as const;

/**
 * Agenda de prise de rendez-vous.
 *
 * La bio Instagram d'Oumaya pointe vers Calendly, là où spec/06 prévoyait
 * Cal.com : le composant accepte les deux et déduit le fournisseur de l'URL.
 * `PUBLIC_CAL_LINK` reste accepté pour rester compatible avec la spec.
 */
const urlAgenda =
  import.meta.env.PUBLIC_AGENDA_URL ?? import.meta.env.PUBLIC_CAL_LINK ?? null;

export const agenda = {
  url: urlAgenda,
  fournisseur: (urlAgenda?.includes('calendly.com') ? 'calendly' : 'cal') as
    | 'calendly'
    | 'cal',
} as const;

export const ressourceSoutien = {
  nom: 'Soins aux Professionnels en Santé',
  telephone: '0 805 23 23 36',
  telephoneLien: 'tel:+33805232336',
} as const;

/** Texte verrouillé, cf. spec/02-conformite.md §1. Ne pas reformuler. */
export const DISCLAIMER_RESULTATS =
  "Les parcours présentés sur ce site sont individuels et ne constituent pas une promesse de résultat. Le closing est une activité indépendante rémunérée à la commission : les revenus dépendent de l’activité réelle de chacun et peuvent être nuls. La Seconde Blouse ne garantit ni mission, ni contrat, ni niveau de revenu.";

/** Complément affiché uniquement dans le bandeau de pied de page. */
export const DISCLAIMER_MEDICAL =
  "Ce programme ne constitue pas un accompagnement médical ou psychologique.";

export const navigation = [
  { libelle: 'Le programme', href: '/programme' },
  { libelle: 'Oumaya', href: '/oumaya' },
  { libelle: 'Témoignages', href: '/temoignages' },
] as const;

export const professions = [
  { valeur: 'ide', label: 'Infirmier·e (IDE)' },
  { valeur: 'as', label: 'Aide-soignant·e' },
  { valeur: 'cadre', label: 'Cadre de santé' },
  { valeur: 'sage-femme', label: 'Sage-femme' },
  { valeur: 'manip-radio', label: 'Manipulateur·rice radio' },
  { valeur: 'kine', label: 'Kinésithérapeute' },
  { valeur: 'autre', label: 'Autre profession de santé' },
] as const;

export type ValeurProfession = (typeof professions)[number]['valeur'];
