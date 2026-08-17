# Prompts de génération d'images

Oumaya ne souhaitant pas exposer son visage, les visuels du site sont des
illustrations sans traits, dans le registre du logo, et non des photographies.

## Méthode

1. **Joindre `src/assets/logo.png` en image de référence** dans Gemini, et
   demander explicitement de reprendre son style. C'est ce qui fait la
   cohérence, bien plus que la description écrite.
2. Prompts en anglais : les modèles d'image rendent la texture et la palette
   plus fidèlement qu'en français.
3. **Ne jamais demander de texte dans l'image.** Les modèles le déforment
   systématiquement. Tout texte est ajouté ensuite, en HTML ou dans le script
   `scripts/generer-images.mjs`.
4. Générer 4 à 6 variantes par prompt, garder la plus sobre. La tentation du
   modèle est d'en faire trop.

## Bloc de style commun

À coller en tête de chaque prompt :

```
Soft hand-drawn digital illustration matching the attached reference image:
delicate pencil-and-watercolour rendering, light thin linework, visible paper
grain, muted and airy. The character's face is completely blank and smooth —
no eyes, no mouth, no nose, no facial features whatsoever. Skin rendered as a
soft neutral tone.

Strict colour palette: warm cream #FBF9F3, soft beige #F2EDE2, muted antique
gold #A98A4F, deep warm brown #2A2219, sage green #A9BBA3, and the white of
medical scrubs. Warm natural daylight, soft diffuse shadows, no black
outlines, no saturated colours.

Plain flat cream #FBF9F3 background, uncluttered. Editorial and calm, adult,
understated. Not cartoonish, not 3D, not glossy, no thick outlines, no anime
style, no vector flat-design.
```

## À proscrire

Reprise de `spec/05-design-system.md` et de `spec/02-conformite.md`. À ajouter
en négatif si le modèle insiste :

```
No money, no banknotes, no coins, no luxury car, no swimming pool, no airport,
no suitcase, no beach. No thumbs up, no crossed arms, no whiteboard, no
podium. No coworking space, no minimalist white designer desk. No stethoscope
around the neck, no red cross, no hospital logo. No text, no lettering, no
watermark, no logo. No facial features.
```

Les cinq premières interdictions ne sont pas esthétiques : les visuels de
statut sont ce qui caractérise les pratiques sanctionnées dans ce secteur.

---

## A. Portrait principal — `src/assets/oumaya-portrait.jpg`

Utilisé dans le hero de l'accueil et sur `/oumaya`. **Format vertical 4:5**,
au moins 1400 px de large. C'est la seule image réellement manquante.

```
[bloc de style]

A woman in her mid-thirties seated at a simple light-wood table in a real
lived-in home interior: a window on the left casting soft daylight, a plant
out of focus behind her, a plain wall. She wears everyday clothes — a soft
knit sweater in cream or sage green — and a slim over-ear telephone headset
with a thin boom microphone. In front of her, an open paper notebook, a pen,
and a plain ceramic mug. Her posture is relaxed and attentive, one hand
resting near the notebook, as if listening carefully to someone on a call.

Three-quarter view from slightly above eye level. Vertical composition,
aspect ratio 4:5, the figure occupying the lower two thirds, quiet space
above.

[bloc à proscrire]
```

**Variante à tester :** remplacer « seated at a table » par « standing near a
window, one hand holding a notebook against her chest ». Plus sobre encore,
et le casque disparaît, ce qui évite de sur-signifier le métier.

## B. Le passage — image de partage de `/oumaya`

Facultatif. Format **1200×630**. Illustre le nom de la marque sans le dire.

```
[bloc de style]

Two moments of the same faceless woman in one horizontal composition,
separated by soft empty cream space rather than a hard line. On the left,
she stands in white medical scrubs and a nurse cap, arms at her sides, in a
bare corridor suggested by a few light strokes. On the right, the same figure
in everyday clothes — a cream knit sweater — seated at a home table with a
notebook and a slim telephone headset, warm daylight around her.

The left side is cooler and emptier, the right side warmer and more open.
Horizontal composition, aspect ratio 1.91:1, generous cream margins.

[bloc à proscrire]
```

Attention : ne pas rendre la partie hôpital sombre ou misérabiliste. Le
contraste doit se jouer sur la lumière et l'espace, pas sur la tristesse.
`spec/01-strategie.md` interdit de suggérer que rester à l'hôpital est un
échec.

## C. Couverture du guide — `/guide`

Facultatif. Format **3:4**, pour illustrer le lead magnet.

```
[bloc de style]

A closed A4 paper booklet lying flat on a plain cream surface, seen from
directly above at a slight angle. The cover is plain warm cream with a wide
antique gold brushstroke across the upper third, and a blank space where a
title would go. Beside it, a pen and a folded pair of reading glasses. Soft
daylight from the upper left, gentle paper texture, a subtle shadow under the
booklet.

Vertical composition, aspect ratio 3:4. No text anywhere on the cover.

[bloc à proscrire]
```

Le titre sera posé en HTML par-dessus, ou laissé de côté : une couverture
muette suffit à signifier « document ».

---

## Intégration

Déposer les fichiers dans `src/assets/` :

| Fichier | Prompt | Détecté par |
|---|---|---|
| `oumaya-portrait.jpg` | A | `PhotoOumaya.astro`, automatiquement |
| `oumaya-passage.jpg` | B | à câbler, image de partage de `/oumaya` |
| `guide-couverture.jpg` | C | à câbler sur `/guide` |

Le portrait est reconnu au build sans autre modification. Les deux autres
demandent quelques lignes.

## Un point à assumer

`spec/08-seo-geo.md` mise sur l'E-E-A-T pour une page de fondatrice : un
visage réel pèse plus qu'une illustration sur ce critère. Le choix reste
défendable, il est cohérent avec l'identité Instagram, et la crédibilité du
site repose surtout sur ce qu'il refuse de promettre. À rouvrir si Oumaya
change d'avis : une seule photo de profil, même de trois quarts dos,
suffirait à combler l'écart.
