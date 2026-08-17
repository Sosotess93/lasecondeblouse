import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const temoignages = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/temoignages' }),
  schema: z.object({
    prenom: z.string(),
    initiale: z.string().length(1),
    ancienneFonction: z.string(),
    service: z.string().optional(),
    /** Format libre lisible, ex. « mars 2025 ». */
    promotion: z.string(),
    citation: z.string(),
    videoUrl: z.url().optional(),
    /**
     * Garde volontaire : un témoignage sans accord écrit archivé fait
     * échouer le build (cf. spec/02-conformite.md §4).
     */
    accordEcrit: z.literal(true),
    /** Contrepartie éventuelle (remise, affiliation), à mentionner si oui. */
    contrepartie: z.string().optional(),
    miseEnAvant: z.boolean().default(false),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    reponse: z.string(),
    ordre: z.number(),
    page: z.enum(['landing', 'programme', 'toutes']).default('landing'),
  }),
});

export const collections = { temoignages, faq };
