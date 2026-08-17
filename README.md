# La Seconde Blouse

Site de La Seconde Blouse, programme de reconversion des professionnels de
santé vers le closing éthique.

**Stack :** Astro 7 · Tailwind CSS v4 · Zod 4 · déploiement Vercel.
**Spécifications :** `./spec/`, lire `spec/02-conformite.md` en premier.

## Démarrer

```bash
npm install
cp .env.example .env   # puis renseigner les clés
npm run dev
```

Le site fonctionne sans aucune variable d'environnement : le formulaire de
lead et l'agenda affichent alors un message explicite au lieu d'échouer
silencieusement.

| Variable | Rôle | Sans elle |
|---|---|---|
| `BREVO_API_KEY`, `BREVO_LIST_ID` | Envoi du guide et séquence e-mail | `/api/lead` répond une erreur claire |
| `BREVO_LIST_RDV_ID` | Liste des demandes de rappel | `BREVO_LIST_ID` est utilisée |
| `PUBLIC_AGENDA_URL` | Agenda (Calendly ou Cal.com, détecté d'après l'URL) | `/rdv` affiche « agenda à connecter » ; le formulaire de rappel fonctionne quand même |
| `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST` | Mesure d'audience sans cookie | Aucun traceur, aucun bandeau cookies |

## Structure

```
spec/                 spécifications (source de vérité pour la copy)
scripts/              check-copy.mjs (conformité), generer-images.mjs
src/
  assets/             logo et portrait : déposer le fichier, rien d'autre à faire
  data/site.ts        toutes les constantes, dont les [À CONFIRMER]
  styles/global.css   tokens couleur / typo / motion
  components/
    layout/           Container, Section, Header, Footer, Disclaimer, cookies
    ui/               Button, Accordion, Field, PhotoOumaya, AConfirmer
    planning/         élément signature : grille de roulement
    sections/         les onze sections de la landing
  content/            témoignages (vide) et FAQ, en collections typées
  pages/              12 pages + /api/lead
```

## Contrôles

```bash
npm run check                    # types
npm run verif:copy               # conformité DGCCRF / code de la consommation
npm run verif:copy -- --strict   # + informations manquantes (avant prod)
```

Le build lance automatiquement `check-copy.mjs`. Un témoignage sans
`accordEcrit: true` fait échouer le build via le schéma Zod de la collection.

## État

Phases 1 à 6 du backlog implémentées. Le site est complet et déployable sur le
plan technique&nbsp;; il n'est **pas publiable en l'état** tant que les
informations de la phase 0 ne sont pas renseignées, en particulier les
mentions légales et le tarif. `npm run verif:copy -- --strict` en donne la
liste exacte.

## Performance mesurée

| Métrique | Cible | Constaté |
|---|---|---|
| JS envoyé sur `/` | < 20 ko gzip | 1,0 ko |
| CSS | n/a | 6,5 ko gzip |
| HTML `/` | n/a | 14,4 ko gzip |
| Polices | n/a | 116 ko (3 familles, sous-ensemble latin) |

Reste à mesurer sur l'environnement de production : LCP, CLS, Lighthouse
mobile.

## Vulnérabilité connue

`npm audit` remonte trois alertes de gravité haute sur `path-to-regexp`, tirées
par `@vercel/routing-utils`, lui-même dépendance de `@astrojs/vercel`. Aucune
version corrigée n'est publiée en amont : `@astrojs/vercel` est déjà à jour.

`npm audit fix --force` rétrograderait l'adaptateur et casserait le build. Ne
pas le lancer. Le code concerné sert au routage côté Vercel au moment du
déploiement, pas au rendu des pages. À revérifier à chaque montée de version de
l'adaptateur.
