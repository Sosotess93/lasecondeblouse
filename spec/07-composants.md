# 07 — Composants

Tous les composants sont des `.astro`. Aucun composant client-side framework.

## Layout

### `Container.astro`
`max-width: var(--container-page)`, padding horizontal 20px mobile / 40px desktop, centré.

### `Section.astro`
```ts
interface Props {
  id?: string;
  tone?: 'clair' | 'sombre' | 'accent';   // défaut 'clair'
  spacing?: 'normal' | 'serre';           // défaut 'normal'
  eyebrow?: string;
  titre?: string;
}
```
- `clair` : fond `service-50`, texte `bloc-900`
- `sombre` : fond `bloc-900`, texte `service-50` — réservé à §4 (compétences) et §9 (appel)
- `accent` : fond `service-100` — pour §8 (transparence)

**Seul ce composant applique de l'espacement vertical de section.** Les enfants n'ajoutent jamais de `mt-*` ou `mb-*` au niveau racine.

Le `eyebrow` est rendu en `--font-mono`, uppercase, `letter-spacing: 0.12em`, couleur `ambre-500` sur fond clair et `ambre-100` sur fond sombre.

### `Header.astro`
Transparent au chargement, devient opaque avec ombre légère au-delà de 400px de scroll (IntersectionObserver sur une sentinelle, pas d'écouteur `scroll`). Trois liens + bouton. Pas de burger.

### `Footer.astro`
4 colonnes desktop / 1 colonne mobile. Le bandeau disclaimer est un composant à part, `Disclaimer.astro`, pour pouvoir être réutilisé sous la section témoignages.

## Planning (signature)

### `PlanningCell.astro`
```ts
interface Props {
  valeur: 'M' | 'S' | 'N' | 'RH' | '';
  etat: 'remplie' | 'repos' | 'liberee';
  delai?: number;   // ms, pour la cascade
}
```
32×32px desktop, 24×24px mobile. Radius 2px. Plex Mono 12px.

### `PlanningGrid.astro`
```ts
interface Props {
  semaines: number;        // 4 sur desktop, 2 sur mobile
  anime?: boolean;         // défaut false
  legendeAvant?: string;
  legendeApres?: string;
}
```
Génère la grille avec des données de roulement plausibles (alternance M/S/N avec RH réglementaires — ne pas produire une grille aberrante, l'audience la lira comme un vrai planning et remarquera l'erreur).

**Animation** (`anime = true`) : après 1,2 s, les cellules passent à l'état `liberee` en cascade de 40 ms, colonne par colonne. La légende change à la fin. Une seule exécution. `aria-hidden="true"` sur la grille ; la légende est dans un `<p>` normal.

Si `prefers-reduced-motion`, rendu direct dans l'état final avec `legendeApres`.

### `PhaseRow.astro`
Une phase du programme, présentée comme une ligne de roulement : marqueur `01`–`04` en mono dans une cellule, titre, description. La phase 4 accepte une prop `avertissement` pour le bloc « ni mission, ni contrat, ni revenu » — rendu en texte plein, pas en petit caractère.

## UI

### `Button.astro`
```ts
interface Props {
  href: string;
  variante?: 'primaire' | 'secondaire';
  taille?: 'normal' | 'compact';
  evenement?: string;   // nom d'événement analytics
}
```
Rend un `<a>`. Focus visible obligatoire. `evenement` ajoute un `data-evt` capté par un listener global unique (voir `09-tracking-rgpd.md`).

### `Accordion.astro`
`<details>` / `<summary>` natifs. Fonctionne sans JS. Un seul ouvert à la fois n'est pas requis — laisser le comportement natif. Chevron en CSS via `::after` et `[open]`.

### `Field.astro`
```ts
interface Props {
  nom: string;
  label: string;
  type?: 'text' | 'email' | 'select';
  requis?: boolean;
  options?: { valeur: string; label: string }[];
  aide?: string;
}
```
Label toujours visible au-dessus du champ, jamais de placeholder en guise de label. Message d'erreur en `aria-live="polite"` sous le champ.

### `Disclaimer.astro`
Texte verrouillé de `02-conformite.md` §1. Prop `variante: 'footer' | 'inline'`.

## Sections

### `Hero.astro`
Asymétrique 7/5. Le H1 en Fraunces avec un retour à la ligne forcé entre les deux phrases (`<br>` sur desktop, naturel sur mobile). La `PlanningGrid` en pleine largeur sous le bloc, débordant du conteneur de 40px de chaque côté sur desktop.

Photo : `astro:assets`, `loading="eager"`, `fetchpriority="high"`, dimensions explicites pour éviter le CLS.

### `Competences.astro`
`<table>` sémantique sur desktop avec `<th scope="col">À l'hôpital</th><th scope="col">En closing</th>`.
Sur mobile (`< 768px`), même table, affichage en cartes via CSS (`display: block` sur les lignes, `::before` avec `content` pour les labels). Ne pas dupliquer le markup.

Section en `tone="sombre"` — c'est le point d'accent visuel de la page.

### `Temoignages.astro`
Lit la collection, filtre `miseEnAvant` sur la landing. Affiche `Disclaimer` en dessous, systématiquement, sans condition. Si la collection est vide, afficher un bloc neutre plutôt que de masquer la section, et ne jamais générer de contenu de remplacement.

### `Appel.astro`
Les 4 temps de l'appel, en `tone="sombre"`. Chaque temps a une durée affichée en mono. Le total doit correspondre à la durée annoncée du créneau Cal.com.

### `Transparence.astro`
`tone="accent"`. Le prix est lu depuis `src/data/site.ts`, jamais écrit en dur dans le composant — il changera.

### `Faq.astro`
Lit la collection, filtre par `page`, trie par `ordre`. Génère aussi le JSON-LD `FAQPage` correspondant (voir `08-seo-geo.md`) à partir des mêmes données, pour qu'ils ne puissent jamais diverger.

### `FormulaireGuide.astro`
Champs : prénom, e-mail, profession (select), consentement (checkbox non pré-cochée), honeypot `societe` en `position: absolute; left: -9999px` avec `tabindex="-1"` et `autocomplete="off"`.

Soumission en `fetch` vers `/api/lead`, sans rechargement. États : repos, envoi, succès, erreur. Le bouton est désactivé pendant l'envoi et son libellé passe à `Envoi…`.

Ne pas utiliser de `<form>` avec action native : la gestion des états d'erreur en pâtit.

### `CalEmbed.astro`
N'insère **pas** l'iframe au chargement. Affiche un bouton ; au clic, injecte le script Cal.com et ouvre l'embed. Économise ~200 ko et évite les cookies tiers déposés sans action de l'utilisateur.

```ts
interface Props {
  lien: string;        // depuis PUBLIC_CAL_LINK
  libelle?: string;
}
```

## Pages légales

`Legal.astro` : layout à une colonne, `max-width: 68ch`, titres en Atkinson (pas Fraunces — registre juridique), sommaire ancré en haut sur les CGV.

Contenu à rédiger avec les informations `[À CONFIRMER]`. **Ne pas générer de CGV à partir d'un modèle générique sans relecture** : elles engagent la responsabilité de l'éditrice et doivent refléter la prestation réelle.
