# 03 — Arborescence et wireframes

## Sitemap

```
/                       Landing principale (page de conversion)
/programme              Détail du programme, phases, tarif, modalités
/oumaya                 Parcours long-format
/temoignages            Tous les témoignages + méthode de collecte
/guide                  Lead magnet — page de capture dédiée
/guide/merci            Confirmation + première orientation
/rdv                    Page de prise de RDV (embed Cal.com) + préparation à l'appel
/mentions-legales
/cgv
/confidentialite
/cookies
```

Pas de blog en v1. Un blog vide ou alimenté à moitié nuit plus qu'il ne sert. À rouvrir en v2 si Oumaya s'engage sur un rythme de publication (voir `08-seo-geo.md`).

## Navigation

**Header** (sticky à partir de 400px de scroll, hauteur réduite) :
`Le programme` · `Oumaya` · `Témoignages` · **[Réserver un appel]**

Sur mobile : logo à gauche, bouton CTA compact à droite, pas de burger. Trois liens ne justifient pas un menu.

**Footer** : navigation secondaire, 4 pages légales, contact, réseaux, disclaimer de résultats en pleine largeur.

## Wireframe — landing `/`

```
┌──────────────────────────────────────────────────────────────┐
│ [LSB]                    programme · oumaya · avis  [Appel]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ── PROGRAMME DE RECONVERSION POUR SOIGNANTS ──              │
│                                                              │
│  Votre métier vous a appris                                  │
│  à écouter quelqu'un qui va mal.                             │
│  On vous apprend à en faire                                  │
│  une activité qui vous appartient.        ┌──────────────┐   │
│                                           │              │   │
│  [ Réserver un appel de découverte ]      │   Oumaya     │   │
│  30 min, gratuit, sans engagement.        │   (photo)    │   │
│  On vous présente le programme            │              │   │
│  et son tarif.                            └──────────────┘   │
│                                                              │
│  ┌─ SIGNATURE : LE ROULEMENT ───────────────────────────┐   │
│  │ L  M  M  J  V  S  D                                   │   │
│  │ N  N  RH M  S  S  N   ← votre planning, décidé        │   │
│  │ RH RH M  M  N  N  S     par quelqu'un d'autre         │   │
│  └───────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│ §2  LE CONSTAT                                               │
│     « Ce n'est pas vous qui lâchez. »                        │
│     4 constats factuels, en colonnes                         │
│     ┌ encadré ressource SPS ─────────────┐                   │
├──────────────────────────────────────────────────────────────┤
│ §3  LE MÉTIER — c'est quoi, le closing ?                     │
│     Définition sobre + comment on est payé                   │
│     + « ce que ce n'est pas » (télémarketing, démarchage)    │
├──────────────────────────────────────────────────────────────┤
│ §4  VOS COMPÉTENCES  ← section la plus forte                 │
│     Tableau 2 colonnes : hôpital → closing                   │
├──────────────────────────────────────────────────────────────┤
│ §5  OUMAYA (condensé, lien vers /oumaya)                     │
├──────────────────────────────────────────────────────────────┤
│ §6  LE PROGRAMME — 4 phases (motif planning)                 │
├──────────────────────────────────────────────────────────────┤
│ §7  TÉMOIGNAGES (3 en avant) + disclaimer                    │
├──────────────────────────────────────────────────────────────┤
│ §8  TRANSPARENCE — prix + « ce que ce n'est pas »            │
├──────────────────────────────────────────────────────────────┤
│ §9  L'APPEL DE DÉCOUVERTE — déroulé en 4 temps               │
├──────────────────────────────────────────────────────────────┤
│ §10 FAQ (accordéon)                                          │
├──────────────────────────────────────────────────────────────┤
│ §11 CTA final + alternative lead magnet                      │
├──────────────────────────────────────────────────────────────┤
│ FOOTER + disclaimer de résultats                             │
└──────────────────────────────────────────────────────────────┘
```

## Justification de l'ordre

Il diffère du dossier initial sur trois points.

**§3 « c'est quoi le closing » est remonté avant le storytelling.** L'audience ne connaît pas le métier, ou l'associe à des vidéos YouTube douteuses. Raconter l'histoire d'Oumaya avant d'avoir défini le métier fait perdre les visiteurs qui se demandent encore de quoi on parle.

**§4 compétences transférables est placé tôt.** C'est l'argument qui retourne l'objection principale (« je ne sais pas vendre, je n'ai jamais fait ça »). Il doit arriver avant que le doute s'installe.

**§8 transparence est une section nouvelle**, absente du dossier initial. Elle contient le prix et un bloc « ce que ce programme n'est pas ». Placée juste avant l'appel, elle fait office de filtre : les visiteurs qui prennent RDV après l'avoir lue sont qualifiés.

**Ce qui a été retiré :** la section « agitation du problème » au sens marketing. Elle devient §2, un constat court et factuel. Sur une audience en souffrance réelle, l'agitation classique produit du rejet, pas du désir.

## Wireframe mobile — hero

```
┌───────────────────────┐
│ [LSB]        [Appel]  │
├───────────────────────┤
│ PROGRAMME POUR        │
│ SOIGNANTS             │
│                       │
│ Votre métier vous a   │
│ appris à écouter      │
│ quelqu'un qui va mal. │
│ On vous apprend à en  │
│ faire une activité    │
│ qui vous appartient.  │
│                       │
│ ┌───────────────────┐ │
│ │ Réserver un appel │ │
│ └───────────────────┘ │
│ 30 min, gratuit.      │
│                       │
│ ┌───────────────────┐ │
│ │  photo Oumaya     │ │
│ └───────────────────┘ │
│                       │
│ L M M J V S D         │
│ N N RH M S S N        │
│ (grille compacte)     │
└───────────────────────┘
```

La grille de roulement passe sous la photo sur mobile et se réduit à 2 lignes.

## Points d'entrée du tunnel

| Source | Destination | Intention |
|---|---|---|
| Bio Instagram / TikTok | `/` | Découverte |
| Lien story « le guide » | `/guide` | Capture e-mail |
| Séquence e-mail J3 | `/programme` | Considération |
| Séquence e-mail J5 | `/rdv` | Décision |
| Bouche-à-oreille | `/temoignages` | Vérification |

Chaque page doit pouvoir être une page d'entrée : header et CTA complets partout, pas de page orpheline.
