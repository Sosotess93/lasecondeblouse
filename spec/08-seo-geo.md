# 08 — SEO et GEO

## Réalité du marché

Les requêtes « devenir closeur » sont saturées et dominées par des acteurs à gros budget. Se battre dessus n'a aucun sens pour ce site.

Le trafic exploitable est ailleurs, sur trois familles de requêtes :

**1. La reconversion soignante** — volume réel, intention forte, concurrence faible.
`reconversion infirmière`, `quitter l'hôpital reconversion`, `métier après infirmière sans reprendre d'études`, `reconversion aide-soignante 2026`, `infirmière en burn out que faire`, `métier bien payé sans diplôme reconversion santé`

**2. Les requêtes de vérification** — c'est là que se joue la conversion.
`la seconde blouse avis`, `oumaya closing avis`, `le closing c'est une arnaque`, `closing éthique c'est quoi`, `formation closing arnaque`

Cette famille est stratégiquement la plus importante. La cible cherchera systématiquement des avis avant de réserver. Si les seules réponses disponibles sont des forums hostiles au secteur, la conversion s'effondre. Une page qui traite frontalement la question — y compris les critiques légitimes du secteur — capte cette recherche au lieu de la subir.

**3. Le métier expliqué** — trafic informationnel, alimente le lead magnet.
`closer métier c'est quoi`, `combien gagne un closer` (à traiter sans donner de chiffre : expliquer le mécanisme de commission), `closing sans expérience`, `statut juridique closer`

## Mapping requête → page

| Page | Intention | `<title>` (≤ 60 car.) |
|---|---|---|
| `/` | Marque + reconversion | `La Seconde Blouse — Reconversion des soignants` |
| `/programme` | Commerciale | `Le programme — contenu, durée et tarif` |
| `/oumaya` | Confiance / E-E-A-T | `Oumaya, d'infirmière à closeuse — son parcours` |
| `/temoignages` | Vérification | `Avis et parcours des participantes` |
| `/guide` | Informationnelle | `7 métiers du digital sans reprendre d'études` |
| `/rdv` | Transactionnelle | `Réserver un appel de découverte` |

Meta descriptions : 150-160 caractères, sans promesse chiffrée (la règle de `02-conformite.md` s'applique aussi aux metas — une meta description trompeuse est une pratique commerciale trompeuse).

Exemple `/` :
> Programme de reconversion pour infirmières, aides-soignantes et professionnels de santé vers le closing éthique. Contenu, tarif et modalités en clair.

## Page à créer en v1.5 — la page de vérification

Une page `/le-closing-est-il-une-arnaque` (ou intégrée à `/programme`), traitant honnêtement :
- Pourquoi le secteur a mauvaise réputation, avec des faits (retraits du CPF, sanctions DGCCRF, pratiques de vente sous pression).
- Comment reconnaître un programme douteux : promesse de revenus chiffrée, prix caché, remise valable pendant l'appel uniquement, absence de mentions légales, témoignages anonymes avec captures de virements.
- Ce que fait La Seconde Blouse différemment, point par point, vérifiable sur le site.

C'est la meilleure page du site en potentiel SEO **et** en conversion : elle répond exactement à la question que se pose la cible, elle est unique sur le marché, et elle est linkable.

## Données structurées

Sur toutes les pages, dans `<head>` :

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "La Seconde Blouse",
  "url": "https://lasecondeblouse.fr",
  "logo": "https://lasecondeblouse.fr/logo.png",
  "description": "Programme de reconversion professionnelle destiné aux professionnels de santé vers le métier de closeur.",
  "founder": { "@type": "Person", "name": "Oumaya" },
  "sameAs": ["[Instagram]", "[TikTok]"]
}
```

Sur `/` : ajouter `WebSite`.
Sur `/oumaya` : `Person` avec `jobTitle`, `alumniOf`, `knowsAbout`. Renforce l'E-E-A-T, qui compte doublement sur un sujet à risque.
Sur `/` et `/programme` : `FAQPage`, généré à partir de la collection FAQ (voir `07-composants.md` — même source de données, jamais de duplication manuelle).
Sur `/programme` : `Course` **uniquement si** les champs peuvent être remplis honnêtement (`provider`, `hasCourseInstance` avec mode et durée). Ne pas déclarer `Course` avec des données approximatives.

**À ne pas implémenter :** `AggregateRating` et `Review` sur le service. Les avis auto-déclarés sur sa propre offre sont ignorés ou pénalisés par Google, et ajoutent un risque juridique sur l'authenticité des avis pour un gain nul.

## Technique

- `sitemap.xml` via `@astrojs/sitemap`, `/guide/merci` exclu.
- `robots.txt` : tout autorisé sauf `/guide/merci` et `/api/`. **Autoriser explicitement les crawlers IA** (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`) — c'est la condition d'existence du GEO.
- Canoniques absolues sur toutes les pages.
- Un seul `<h1>` par page, hiérarchie stricte.
- Open Graph + Twitter Card, image OG 1200×630 par page principale.
- `hreflang` inutile (mono-marché FR).
- Core Web Vitals : cibles définies dans `06-stack-astro.md`.

## GEO

L'audience de ce site pose ses questions à ChatGPT autant qu'à Google — « je suis infirmière en burn out, quelles reconversions sont possibles ? » est une requête typique de moteur génératif.

**Ce qui rend un contenu citable par un LLM :** densité factuelle, réponses directes en début de section, définitions explicites, données vérifiables, et une position claire plutôt que du contenu promotionnel vague. Le site est déjà écrit dans ce registre, ce qui joue en sa faveur.

**Leviers concrets :**
1. Chaque section commence par une phrase qui répond, avant de développer. Un LLM extrait des passages autonomes.
2. Les définitions sont explicites et autoportantes (« Le closing consiste à… »), pas allusives.
3. La FAQ est le format le plus repris par les moteurs génératifs. La garder factuelle et exhaustive.
4. Le tableau des compétences transférables est un actif GEO fort : c'est un contenu unique, structuré, factuel, sur une question réellement posée aux LLM.
5. Présence hors-site : les moteurs génératifs citent les sources tierces. Un article invité sur un média infirmier vaut plus qu'une page de plus sur le site.

**Prompts de test à passer mensuellement** (ChatGPT, Perplexity, Gemini, Claude) :

```
1. "Je suis infirmière en burn out, quelles reconversions sont possibles sans reprendre d'études ?"
2. "La Seconde Blouse, c'est quoi ?"
3. "Le closing est-il une arnaque ?"
4. "Quelles formations au closing sont sérieuses en France ?"
5. "Quelles compétences d'infirmière sont transférables dans le digital ?"
```

Objectif à 6 mois : apparaître sur les prompts 1, 2 et 5. Les prompts 3 et 4 sont hors de portée à court terme et ne doivent pas être forcés.

## Hors-site

Actions à impact réel, par ordre de rentabilité :

1. **Fiche Google Business Profile** — `[À CONFIRMER]` si activité localisée déclarée. Sinon ignorer.
2. **Article invité sur des médias infirmiers** (Infirmiers.com, ActuSoins) sur le thème de la reconversion. Difficile mais très qualifiant, en SEO comme en GEO.
3. **Podcasts et interviews** dans l'écosystème soignant. Le format génère des transcriptions indexables.
4. **Réponses sur les forums** (Doctissimo santé pro, groupes Facebook infirmiers) — sans spam, en s'identifiant clairement. La transparence est un avantage concurrentiel ici.
5. **Annuaires** : faible valeur, à traiter en dernier.

Ne pas acheter de liens. Sur un secteur déjà surveillé, un profil de backlinks artificiel est un risque disproportionné.

## Suivi

| KPI | Outil | Cible 6 mois |
|---|---|---|
| Sessions organiques | GSC / PostHog | Base à établir au lancement |
| Position moyenne « reconversion infirmière » | GSC | Top 20 |
| Taux de clic sur `/` | GSC | > 4 % |
| Conversion visite → RDV réservé | PostHog | 1,5–3 % |
| Conversion visite → lead magnet | PostHog | 4–8 % |
| Prompts GEO où la marque apparaît | Test manuel | 3 sur 5 |
| LCP mobile `/` | PageSpeed | < 1,8 s |

Les taux de conversion sont des ordres de grandeur pour un tunnel B2C à ticket élevé, pas des engagements.
