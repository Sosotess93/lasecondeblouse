# Images sources

Traitées par `astro:assets` : redimensionnement, AVIF/WebP, dimensions
explicites posées dans le HTML pour éviter tout décalage de mise en page.

## Fichiers attendus

| Nom | Format | Utilisé par | Statut |
|---|---|---|---|
| `logo.png` | PNG à fond transparent | en-tête, pied de page, `/oumaya`, image OG | en place |
| `oumaya-portrait.jpg` | 4:5 | `PhotoOumaya.astro`, hero et `/oumaya` | en place |
| `oumaya-passage.jpg` | paysage | image de partage de `/oumaya`, via `generer-images.mjs` | en place |
| `guide-couverture.jpg` | 3:4 | `/guide`, décorative | en place |

Les illustrations sont générées, sans visage, dans le style du logo. Les
prompts sont conservés dans `docs/prompts-images.md`.

Les composants détectent la présence du fichier au build et basculent
automatiquement dessus. Tant qu'il est absent, ils affichent un cadre explicite
plutôt qu'une image de remplacement. Rien d'autre à modifier dans le code.

Après avoir remplacé `oumaya-passage.jpg`, relancer
`node scripts/generer-images.mjs` pour régénérer `public/og-oumaya.jpg`.

## Le logo

Le fichier fourni pour Instagram est un carré à fond blanc. Il ne convient pas
tel quel : le blanc des angles jure avec le crème du site, et le coup de
pinceau se découpe. Il faut une version détourée.

L'en-tête est sur fond encre, comme le pied de page : c'est ce qui rend le
logo complet lisible à 56 px de haut. Sur le crème du site, le coup de
pinceau et la blouse blanche s'effacent presque entièrement.
