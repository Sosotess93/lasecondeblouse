# 10 — Backlog d'implémentation

Découpage pensé pour être exécuté phase par phase par Claude Code, avec un point de contrôle humain entre chaque.

## Phase 0 — Informations à obtenir d'Oumaya

**Bloquant pour la mise en ligne**, pas pour le développement.

- [ ] Raison sociale, forme juridique, SIREN, adresse du siège
- [ ] Statut organisme de formation : déclaration d'activité ? Qualiopi ? RNCP ?
- [ ] Tarif du programme + modalités de paiement échelonné
- [ ] Durée, format, volume horaire hebdomadaire, taille des groupes
- [ ] Partenaires réels pour la phase 4 + accord de citation
- [ ] 3 à 6 témoignages avec accord écrit signé
- [ ] Son parcours en détail, avec ses mots (pour `/oumaya`)
- [ ] Photos professionnelles
- [ ] Nom de domaine, adresses e-mail
- [ ] Adhésion à un médiateur de la consommation
- [ ] Comptes Instagram / TikTok à lier
- [ ] Le guide PDF, ou décision de le produire

## Phase 1 — Socle

1. Init Astro 5 + TypeScript strict, Tailwind v4 via `@tailwindcss/vite`
2. `global.css` avec les tokens de `05-design-system.md`
3. Polices Fontsource, préchargement de la variante hero uniquement
4. `Base.astro`, `Container`, `Section`, `Header`, `Footer`, `Disclaimer`, `Button`
5. `src/data/site.ts` avec toutes les constantes (URLs, e-mail, prix, liens sociaux)
6. Page d'accueil vide structurée, sections en placeholder
7. Vérification : Lighthouse ≥ 98 sur une page vide, aucun JS envoyé

**Contrôle :** le rythme vertical et la typo sont bons avant d'écrire du contenu. Corriger ici coûte dix fois moins cher que plus tard.

## Phase 2 — Signature

8. `PlanningCell`, `PlanningGrid`, générateur de roulement plausible
9. Animation de libération des cellules, respect de `prefers-reduced-motion`
10. Intégration dans le hero avec la photo
11. Test sur mobile réel, pas seulement en devtools

**Contrôle :** si la grille ne produit pas d'effet sur une personne du métier, la direction est à revoir avant d'aller plus loin. C'est l'élément qui porte l'identité du site.

## Phase 3 — Contenu de la landing

12. Sections §2 à §11 avec la copy de `04-copy.md`, sans altération
13. `Competences` en table sémantique + adaptation mobile en CSS pur
14. Content collections témoignages et FAQ + script `check-copy.ts` en pre-build
15. `Accordion` en `<details>` natifs
16. Disclaimer en footer et sous les témoignages

**Contrôle :** passer la checklist de recette de `02-conformite.md` §9 intégralement.

## Phase 4 — Conversion

17. `FormulaireGuide` + route `/api/lead` + intégration Brevo
18. Honeypot, horodatage, validation Zod, rate limit
19. `CalEmbed` en chargement différé au clic
20. Pages `/guide` et `/guide/merci`
21. Événements analytics sur `[data-evt]`

**Contrôle :** un lead de test arrive bien dans Brevo, la séquence part, la désinscription fonctionne.

## Phase 5 — Pages secondaires

22. `/programme`, `/oumaya`, `/temoignages` (avec la section méthode de collecte), `/rdv`
23. `Legal.astro` + les 4 pages légales
24. `/404`

## Phase 6 — SEO / GEO / mise en production

25. Metadata par page, OG images, canoniques
26. JSON-LD `Organization`, `WebSite`, `Person`, `FAQPage` généré depuis la collection
27. `robots.txt` avec autorisation explicite des crawlers IA, sitemap
28. Audit Lighthouse mobile sur toutes les pages, cible ≥ 95
29. Test lecteur d'écran sur la landing (VoiceOver ou NVDA)
30. Déploiement, DNS, HTTPS, Search Console
31. Relecture juridique des CGV et mentions légales

**Contrôle final avant mise en ligne :**
```bash
grep -rniE '\d+\s?(€|euros|k€)|doubler|tripler|garanti|placement assuré' src/
```
Zéro résultat, hors le prix officiel dans `site.ts` et la page transparence.

## Phase 7 — Après le lancement

32. Page `/le-closing-est-il-une-arnaque` (fort potentiel SEO et conversion)
33. Séquence e-mail 5 jours dans Brevo
34. Tests GEO mensuels sur les 5 prompts de `08-seo-geo.md`
35. Collecte continue de témoignages avec accord écrit
36. Éventuellement, blog — seulement si un rythme de publication est tenable

## Estimation

| Phase | Charge |
|---|---|
| 1 — Socle | 0,5 j |
| 2 — Signature | 1 j |
| 3 — Contenu landing | 1,5 j |
| 4 — Conversion | 1 j |
| 5 — Pages secondaires | 1 j |
| 6 — SEO et mise en prod | 1 j |
| **Total développement** | **~6 jours** |

Hors production de contenu (photos, témoignages, guide PDF, rédaction juridique), qui dépend d'Oumaya et constitue le vrai chemin critique.

## Risques

| Risque | Mitigation |
|---|---|
| Oumaya insiste pour afficher des revenus | Montrer `02-conformite.md`, expliquer le risque de sanction. Position ferme : c'est une condition de la prestation. |
| Pas de témoignages avec accord écrit au lancement | Lancer sans la section plutôt qu'avec des faux. Le schéma Zod bloque le build de toute façon. |
| Le tarif n'est pas arrêté | Publier une fourchette d'entrée ou « à partir de », plutôt que rien. |
| Statut juridique non finalisé | Bloquant absolu pour la mise en ligne : sans mentions légales valides, le site est en infraction dès la première visite. |
| Le client trouve le design « pas assez vendeur » | Argumenter avec `01-strategie.md` : la sobriété est le positionnement, pas un défaut d'exécution. Proposer un A/B test sur le hero plutôt qu'un retour au template. |
