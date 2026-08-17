# 06 — Stack et architecture Astro

## Choix

| Sujet | Décision |
|---|---|
| Framework | **Astro 5**, `output: 'static'` avec routes serveur ponctuelles |
| CSS | **Tailwind CSS v4** via `@tailwindcss/vite` (pas l'intégration Astro, dépréciée) |
| Composants interactifs | Aucun framework UI. Astro + `<script>` vanilla. Le site a trois interactions : menu, FAQ, formulaire. React ici serait 40 ko pour rien. |
| Contenus structurés | Content Layer (`astro:content`) avec loaders JSON pour témoignages et FAQ |
| Images | `astro:assets`, format AVIF + WebP |
| Polices | `@fontsource-variable/*`, auto-hébergées. Pas de Google Fonts en CDN (RGPD + performance) |
| Prise de RDV | **Cal.com** en embed |
| E-mails / séquence | **Brevo** (interface FR, séquences incluses) |
| Analytics | **PostHog auto-hébergé** ou **Plausible**, en mode sans cookie |
| Hébergement | Vercel (ou serveur OVH existant sous nginx/PM2 — voir plus bas) |

## Arborescence

```
laseconde-blouse/
├── CLAUDE.md
├── spec/                          ← ce dossier
├── astro.config.mjs
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── og-default.jpg
│   └── guide-metiers-digital.pdf   [À CONFIRMER]
└── src/
    ├── styles/
    │   └── global.css              ← @theme, tokens, reset
    ├── content.config.ts
    ├── content/
    │   ├── temoignages/*.json
    │   └── faq/*.json
    ├── data/
    │   └── site.ts                 ← constantes : URLs, e-mail, SIREN, prix
    ├── layouts/
    │   ├── Base.astro
    │   └── Legal.astro
    ├── components/
    │   ├── layout/    Header, Footer, Section, Container
    │   ├── ui/        Button, Card, Accordion, Field
    │   ├── planning/  PlanningGrid, PlanningCell, PhaseRow
    │   └── sections/  Hero, Constat, Metier, Competences,
    │                  Oumaya, Programme, Temoignages,
    │                  Transparence, Appel, Faq, CtaFinal
    ├── pages/
    │   ├── index.astro
    │   ├── programme.astro
    │   ├── oumaya.astro
    │   ├── temoignages.astro
    │   ├── rdv.astro
    │   ├── guide/index.astro
    │   ├── guide/merci.astro
    │   ├── mentions-legales.astro
    │   ├── cgv.astro
    │   ├── confidentialite.astro
    │   ├── cookies.astro
    │   ├── 404.astro
    │   └── api/lead.ts             ← prerender = false
    └── lib/
        ├── brevo.ts
        └── validate.ts
```

## Dépendances

```bash
npm create astro@latest laseconde-blouse -- --template minimal --typescript strict

npm i -D tailwindcss @tailwindcss/vite
npm i @astrojs/sitemap @astrojs/vercel
npm i @fontsource-variable/fraunces @fontsource/atkinson-hyperlegible-next @fontsource-variable/ibm-plex-mono
npm i zod
```

Vérifier le nom exact du paquet Fontsource pour Atkinson Hyperlegible Next avant installation ; à défaut, utiliser `@fontsource/atkinson-hyperlegible`.

## `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://lasecondeblouse.fr',   // [À CONFIRMER]
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: false } }),
  integrations: [sitemap({
    filter: (page) => !page.includes('/guide/merci'),
  })],
  vite: { plugins: [tailwind()] },
  image: { formats: ['avif', 'webp'] },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
```

## `src/styles/global.css`

Tailwind v4 se configure en CSS, pas en `tailwind.config.js`.

```css
@import "tailwindcss";

@import "@fontsource-variable/fraunces";
@import "@fontsource/atkinson-hyperlegible-next/400.css";
@import "@fontsource/atkinson-hyperlegible-next/700.css";
@import "@fontsource-variable/ibm-plex-mono";

@theme {
  --color-bloc-900: #0A2B31;
  --color-bloc-700: #12454E;
  --color-bloc-500: #2A6B75;
  --color-bloc-200: #A7C4C7;
  --color-service-50: #FAFBFB;
  --color-service-100: #EFF3F2;
  --color-service-200: #DDE5E4;
  --color-ambre-500: #D98324;
  --color-ambre-600: #B96C18;
  --color-ambre-100: #FBEBD6;
  --color-repos-400: #6E9E90;

  --font-display: "Fraunces Variable", Georgia, serif;
  --font-body: "Atkinson Hyperlegible Next", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono Variable", ui-monospace, monospace;

  --container-page: 1180px;
}
```

**Attention aux conflits de spécificité** : définir l'espacement vertical des sections dans un seul composant `Section.astro` avec une prop `spacing`, jamais en cumulant une classe `.section` et des marges appliquées aux éléments enfants. C'est la source d'erreur la plus fréquente sur ce type de page longue.

## Content collections

`src/content.config.ts` :

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const temoignages = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/temoignages' }),
  schema: z.object({
    prenom: z.string(),
    initiale: z.string().length(1),
    ancienneFonction: z.string(),
    service: z.string().optional(),
    promotion: z.string(),          // "mars 2025"
    citation: z.string(),
    videoUrl: z.string().url().optional(),
    accordEcrit: z.literal(true),   // bloque le build sans accord
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
```

Le champ `accordEcrit: z.literal(true)` est une garde volontaire : un témoignage sans accord archivé fait échouer le build.

**Garde-fou supplémentaire** — ajouter un test de build qui échoue si un fichier de `content/temoignages/` contient un montant en euros :

```ts
// scripts/check-copy.ts — exécuté en pre-build
const INTERDITS = /\d+\s?(€|euros|k€|K€)|doubler|tripler|garanti/i;
```

## Route API `/api/lead`

```ts
// src/pages/api/lead.ts
export const prerender = false;
```

Responsabilités : validation Zod, honeypot anti-spam (champ caché `societe`), rate limit basique par IP, création du contact Brevo avec l'attribut `PROFESSION` et ajout à la liste séquence, réponse JSON. Ne jamais renvoyer les détails d'erreur du fournisseur au client.

Variables d'environnement (`.env`, jamais commité) :
```
BREVO_API_KEY=
BREVO_LIST_ID=
PUBLIC_CAL_LINK=
PUBLIC_POSTHOG_KEY=
PUBLIC_POSTHOG_HOST=
```

## Performance — cible

| Métrique | Cible |
|---|---|
| LCP | < 1,8 s en 4G |
| CLS | < 0,05 |
| JS envoyé sur `/` | < 20 ko gzip |
| Poids total `/` | < 450 ko |
| Lighthouse mobile | ≥ 95 sur les 4 axes |

Leviers : zéro framework client, polices auto-hébergées avec `font-display: swap` et préchargement de la seule variante utilisée en hero, photo d'Oumaya en `loading="eager"` + `fetchpriority="high"` et toutes les autres en `lazy`, embed Cal.com chargé uniquement au clic (pas d'iframe au chargement de la page).

## Déploiement

**Option A — Vercel.** Import du dépôt GitHub, build `npm run build`, variables d'environnement dans le dashboard. Preview automatique par PR.

**Option B — serveur OVH existant.** Build statique + `rsync` vers `/var/www/lasecondeblouse`, bloc nginx dédié, certificat via certbot. La route `/api/lead` nécessite alors un petit process Node sous PM2 en reverse proxy, ou un basculement de la soumission de formulaire directement vers l'API Brevo depuis le client — dans ce cas, utiliser une clé restreinte et non la clé principale.

Option A recommandée pour la v1 : moins de surface à maintenir pour un site qui n'a qu'un endpoint.

## `CLAUDE.md` à la racine

```md
# La Seconde Blouse

Site Astro 5 + Tailwind v4. Spécifications complètes dans ./spec/.

## Règles non négociables
1. Lire ./spec/02-conformite.md avant d'écrire ou modifier toute copy.
2. Aucun chiffre de revenu, aucun multiple, aucun délai de résultat, nulle part.
3. Aucune promesse d'emploi, de mission ou de placement.
4. Aucun témoignage inventé, même en placeholder.
5. Pas de compte à rebours ni de rareté artificielle.
6. Le disclaimer de résultats est présent sur toutes les pages.

## Conventions
- Composants Astro uniquement, pas de framework UI client.
- Tokens de couleur et de typo depuis src/styles/global.css, jamais de valeur en dur.
- Espacement vertical géré par <Section>, jamais par des marges ad hoc.
- Texte en français, vouvoiement, sentence case sur les boutons.
- Accessibilité : focus visible, contraste AA minimum, cibles ≥ 44px.

## Commandes
npm run dev · npm run build · npm run preview · npm run check
```
