# 05 — Design system

## Direction artistique

Le dossier initial suggérait Playfair Display + beige/sable + terracotta/vieux rose. C'est la combinaison qu'on retrouve sur la quasi-totalité des tunnels d'infopreneurs français, et sur cette audience précisément — qui a déjà scrollé vingt pages identiques — elle produit l'effet inverse de celui recherché : elle signale le template, donc le vendeur, donc la méfiance.

**Direction retenue : le monde hospitalier, mais côté vestiaire.**

Pas le vert clinique, pas le blanc froid des couloirs. Les couleurs du bloc et du textile de service : un bleu-vert profond, celui des champs opératoires et des tuniques de bloc, associé à un blanc cassé légèrement froid — celui du coton lavé mille fois. Et un ambre chaud, la couleur de la lumière des veilleuses à trois heures du matin, qui sert d'unique accent.

Le résultat est sobre, adulte, plus proche d'un site institutionnel de santé que d'une page de vente. C'est exactement l'effet voulu.

## Signature : le roulement

L'élément mémorable du site est la **grille de planning**.

La vie d'un soignant est organisée par le roulement : une grille de cellules M / S / N / RH que quelqu'un d'autre remplit. C'est l'objet le plus universellement partagé par l'audience, et le symbole le plus exact de ce qu'elle vient chercher — non pas plus d'argent, mais le stylo.

**Usages du motif :**
1. **Hero** — une grille de 4 semaines en mono, remplie, dense, avec la légende « Votre mois de mars. Vous ne l'avez pas choisi. » Au scroll (ou après 1,2 s), les cellules se vident progressivement de gauche à droite, et la légende devient « Et si vous le remplissiez vous-même ? ». Une seule fois, pas en boucle.
2. **Section programme** — les 4 phases sont présentées comme les 4 lignes d'un roulement, avec les marqueurs `01 → 04` en mono. Ici la numérotation est légitime : c'est une vraie séquence.
3. **Séparateurs de section** — une ligne de cellules vides, hauteur 8px, opacité faible. Discret.
4. **Favicon / logo** — une cellule de grille avec un trait, plutôt qu'une blouse ou un stéthoscope.

Ne pas décliner le motif ailleurs. Un signature element cesse d'en être un quand il apparaît partout.

## Tokens couleur

```css
@theme {
  /* Bleu de bloc — fonds sombres, texte principal, autorité */
  --color-bloc-900: #0A2B31;
  --color-bloc-700: #12454E;
  --color-bloc-500: #2A6B75;
  --color-bloc-200: #A7C4C7;

  /* Blanc de service — fond principal, légèrement froid, jamais crème */
  --color-service-50:  #FAFBFB;
  --color-service-100: #EFF3F2;
  --color-service-200: #DDE5E4;

  /* Ambre — accent unique : CTA, focus, chiffres clés */
  --color-ambre-500: #D98324;
  --color-ambre-600: #B96C18;
  --color-ambre-100: #FBEBD6;

  /* Repos — états positifs, cellules libérées du planning */
  --color-repos-400: #6E9E90;

  --color-craie: #FFFFFF;
}
```

Répartition cible : ~70 % service, ~22 % bloc, ~6 % craie, ~2 % ambre. L'ambre ne sert qu'aux CTA, aux états de focus et aux marqueurs de séquence. S'il apparaît trois fois dans un même écran, en retirer deux.

**Interdits :** dégradés multicolores, glassmorphism, ombres colorées, néons, vert médical saturé (#00A86B et voisins), rouge d'urgence.

## Typographie

| Rôle | Police | Justification |
|---|---|---|
| Display | **Fraunces** (variable, `opsz`, `SOFT`) | Serif contemporaine, chaleureuse sans être décorative. Elle porte l'humain sans virer au faire-part de mariage comme Playfair. Utilisée uniquement en H1/H2. |
| Corps | **Atkinson Hyperlegible Next** | Conçue par le Braille Institute pour la lisibilité en conditions dégradées. L'audience lit sur téléphone, en fin de garde, à 1h du matin, fatiguée. Ce n'est pas un argument décoratif : c'est le bon outil pour le contexte de lecture réel. |
| Mono | **IBM Plex Mono** | Le planning, les eyebrows, les marqueurs de phase, les labels. Registre « document de service », par opposition au registre marketing. |

```css
--font-display: "Fraunces", Georgia, serif;
--font-body: "Atkinson Hyperlegible Next", system-ui, sans-serif;
--font-mono: "IBM Plex Mono", ui-monospace, monospace;
```

**Échelle** (mobile → desktop, `clamp`)

| Token | Taille | Usage |
|---|---|---|
| `display` | `clamp(2.25rem, 6vw, 4.25rem)` | H1. Fraunces 400, `line-height: 1.05`, `letter-spacing: -0.02em` |
| `h2` | `clamp(1.75rem, 4vw, 2.75rem)` | Fraunces 400, `line-height: 1.15` |
| `h3` | `clamp(1.15rem, 2vw, 1.4rem)` | Atkinson 600 |
| `lead` | `clamp(1.05rem, 2vw, 1.3rem)` | Chapôs. Atkinson 400, `line-height: 1.6` |
| `body` | `1.0625rem` | `line-height: 1.7`. Ne pas descendre sous 17px sur mobile. |
| `label` | `0.75rem` | Plex Mono, `letter-spacing: 0.12em`, uppercase |

Largeur de ligne : `max-width: 62ch` sur tout bloc de texte courant. Non négociable pour cette audience.

## Layout

- Grille 12 colonnes, gouttière 24px, conteneur max `1180px`.
- Rythme vertical : sections en `py-24` mobile / `py-36` desktop. Une seule classe de section, pas de surcharge par variante — attention aux conflits de spécificité entre `.section` et les sélecteurs d'éléments.
- Le hero est asymétrique : texte sur 7 colonnes à gauche, photo sur 5 à droite, la grille de roulement traverse toute la largeur en bas de hero.
- Rayons : `4px` par défaut, `2px` sur les cellules de planning. Jamais de `border-radius` supérieur à 8px sauf sur la photo d'Oumaya (`12px`). Le monde hospitalier est carré.
- Bordures `1px solid --color-service-200` plutôt que des ombres. Une seule ombre autorisée sur tout le site : le header en position sticky.

## Composants clés — apparence

**Bouton primaire**
Fond `ambre-500`, texte `bloc-900`, `padding: 14px 28px`, radius 4px, `font-body 600`. Hover : `ambre-600`, translation `-1px`. Focus : outline 2px `bloc-900`, offset 2px.

**Bouton secondaire**
Transparent, bordure 1px `bloc-500`, texte `bloc-700`.

**Cellule de planning**
`32×32px` (24px sur mobile), bordure 1px `service-200`, Plex Mono 12px, centré. Trois états : remplie (fond `bloc-700`, texte `service-50`), repos (fond `service-100`, texte `bloc-500`), libérée (fond transparent, bordure pointillée `repos-400`).

**Tableau des compétences**
Deux colonnes sur desktop, séparées par une règle verticale 1px. Sur mobile, chaque paire devient une carte : la ligne « hôpital » en `bloc-700` sur fond clair, la ligne « closing » en dessous, décalée de 16px avec un trait ambre à gauche.

## Motion

Volontairement rare. Trois moments, pas un de plus :

1. **Le roulement du hero** — séquence unique au chargement, 1,4 s, cellules qui se vident en cascade de 40 ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
2. **Révélation au scroll** — opacité 0→1 et translation 12px→0 sur les titres de section uniquement, seuil 20 %, une seule fois.
3. **Micro-interactions** — hover boutons et liens, 150 ms.

Aucun parallaxe, aucun compteur animé, aucun élément qui bouge en permanence.

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
La grille du hero doit s'afficher dans son état final (vidée) si `prefers-reduced-motion` est actif — pas dans son état initial.

## Accessibilité — plancher de qualité

- Contraste AA minimum partout, AAA sur le corps de texte. Vérifier `ambre-500` sur `service-50` : insuffisant pour du texte, réservé aux fonds de boutons avec texte foncé.
- Focus visible sur tous les éléments interactifs, jamais `outline: none` sans remplacement.
- Cibles tactiles ≥ 44×44px.
- Le tableau des compétences en `<table>` avec `<th scope>`, pas en divs.
- FAQ en `<details>/<summary>` natifs, stylés. Fonctionne sans JS.
- La grille de planning est décorative : `aria-hidden="true"` sur la grille, et la légende reste lisible par les lecteurs d'écran.
- Images : `alt` descriptif sur la photo d'Oumaya, `alt=""` sur le décoratif.

## Photographie

`[À CONFIRMER]` — shooting à prévoir.

Direction : lumière naturelle, intérieur domestique réel (pas de bureau de coworking, pas de MacBook sur une table blanche), Oumaya en tenue de ville simple. Un plan avec un casque téléphonique en situation de travail, un plan portrait, un plan à hauteur d'œil.

**À éviter absolument :** bras croisés devant un fond flou, pouce levé, tableau blanc, voiture, capture d'écran de tableau de bord, valise à l'aéroport.
