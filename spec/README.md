# La Seconde Blouse — Package de spécifications

Spec complète pour la construction du site (landing + tunnel) de **La Seconde Blouse**, programme de reconversion des soignants vers le closing éthique, porté par Oumaya.

**Stack cible :** Astro 5 · Tailwind CSS v4 · déploiement Vercel (ou serveur OVH existant).

---

## Ordre de lecture

| Fichier | Rôle |
|---|---|
| `01-strategie.md` | Positionnement, avatar, promesse, ce qu'on ne promet pas |
| `02-conformite.md` | **À lire avant d'écrire une ligne de copy.** Cadre légal FR, formulations interdites/autorisées |
| `03-arborescence.md` | Sitemap, wireframes ASCII, ordre des sections |
| `04-copy.md` | Copy finalisée, prête à intégrer |
| `05-design-system.md` | Tokens couleur/typo, motif signature, motion |
| `06-stack-astro.md` | Arborescence projet, dépendances, config, déploiement |
| `07-composants.md` | Spec de chaque composant Astro |
| `08-seo-geo.md` | Metadata, données structurées, visibilité moteurs génératifs |
| `09-tracking-rgpd.md` | Analytics, consentement, formulaires, prise de RDV |
| `10-backlog.md` | Découpage en phases d'implémentation |

## Utilisation avec Claude Code

```bash
# Depuis un dossier vide
npm create astro@latest . -- --template minimal --typescript strict --no-git
# Puis :
claude "Lis l'intégralité de ./spec/ et implémente la phase 1 du backlog (10-backlog.md).
Respecte strictement 02-conformite.md sur toute copy générée."
```

Copier ce dossier en `./spec/` à la racine du projet, et ajouter un `CLAUDE.md` à la racine pointant vers lui (voir `06-stack-astro.md`).

## Statut des informations

Les éléments suivants sont **à confirmer avec Oumaya** avant mise en ligne — ils sont marqués `[À CONFIRMER]` dans les fichiers :

- Structure juridique (SASU / EI / organisme de formation ?) et n° SIREN
- Tarif du programme et modalités de paiement
- Existence ou non d'une certification Qualiopi / RNCP
- Partenaires réels pour la mise en relation (phase 4)
- Témoignages : accord écrit + vérifiabilité
- Photos professionnelles d'Oumaya
- Nom de domaine et adresse e-mail de contact
