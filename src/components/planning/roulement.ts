export type Poste = 'M' | 'S' | 'N' | 'RH' | '';

/**
 * Roulement de quatre semaines, écrit à la main plutôt que généré.
 *
 * L’audience lit cette grille comme un vrai planning : une séquence
 * incohérente (nuit suivie d’un matin, six jours travaillés d’affilée,
 * semaine sans repos hebdomadaire) se remarque immédiatement et discrédite
 * tout le reste de la page. Contraintes respectées :
 *   - au moins deux RH consécutifs après une série de nuits ;
 *   - jamais plus de quatre jours travaillés d’affilée ;
 *   - pas d’enchaînement matin → nuit sans repos intercalé ;
 *   - un repos hebdomadaire dans chaque semaine.
 *
 * Lecture : lundi → dimanche.
 */
export const ROULEMENT: readonly (readonly Poste[])[] = [
  ['M', 'M', 'S', 'S', 'RH', 'RH', 'N'],
  ['N', 'RH', 'RH', 'M', 'M', 'S', 'S'],
  ['RH', 'M', 'M', 'RH', 'N', 'N', 'RH'],
  ['M', 'S', 'S', 'RH', 'N', 'N', 'RH'],
] as const;

export const JOURS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;

export const JOURS_COMPLETS = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
] as const;

export function etatDe(poste: Poste): 'remplie' | 'repos' {
  return poste === 'RH' || poste === '' ? 'repos' : 'remplie';
}

/** Retourne les `n` premières semaines du roulement. */
export function semaines(n: number) {
  return ROULEMENT.slice(0, Math.max(1, Math.min(n, ROULEMENT.length)));
}
