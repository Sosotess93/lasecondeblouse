import { getCollection, type CollectionEntry } from 'astro:content';

export type PageFaq = 'landing' | 'programme';

/**
 * Source unique de la FAQ : le composant d’affichage et le JSON-LD lisent
 * tous les deux cette fonction, pour qu’ils ne puissent jamais diverger
 * (cf. spec/07-composants.md §Faq).
 */
export async function entreesFaq(
  page: PageFaq
): Promise<CollectionEntry<'faq'>[]> {
  const entrees = await getCollection('faq');
  return entrees
    .filter((entree) => entree.data.page === page || entree.data.page === 'toutes')
    .sort((a, b) => a.data.ordre - b.data.ordre);
}

export function schemaFaq(entrees: CollectionEntry<'faq'>[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entrees.map((entree) => ({
      '@type': 'Question',
      name: entree.data.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entree.data.reponse,
      },
    })),
  };
}
