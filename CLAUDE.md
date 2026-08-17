# La Seconde Blouse

Site Astro 5 + Tailwind v4. Spécifications complètes dans `./spec/`.

## Règles non négociables

1. Lire `./spec/02-conformite.md` avant d'écrire ou de modifier toute copy.
2. Aucun chiffre de revenu, aucun multiple, aucun délai de résultat, nulle part.
3. Aucune promesse d'emploi, de mission ou de placement.
4. Aucun témoignage inventé, **même en placeholder de développement**.
5. Pas de compte à rebours ni de rareté artificielle.
6. Le disclaimer de résultats est présent sur toutes les pages, et sous toute
   section contenant des témoignages.

`scripts/check-copy.mjs` fait respecter ces règles au build. Ne pas le
contourner : si une formulation légitime est bloquée, l'ajouter à la liste
`AUTORISES` du script, ce qui documente la décision.

## Conventions

- Composants `.astro` uniquement, aucun framework UI côté client.
- Tokens de couleur et de typo depuis `src/styles/global.css`, jamais de valeur
  en dur dans un composant.
- Espacement vertical de section géré exclusivement par `<Section>`. Les
  enfants n'ajoutent jamais de `mt-*` / `mb-*` au niveau racine.
- Toute constante (URL, e-mail, SIREN, tarif, durées) vient de
  `src/data/site.ts`. Les champs `null` sont les informations manquantes de la
  phase 0 du backlog.
- Texte en français, vouvoiement, sentence case sur les boutons, apostrophes
  typographiques (`’`).
- Accessibilité : focus visible, contraste AA minimum, cibles ≥ 44px.

## Serveur de développement

Astro 7 démarre `astro dev` en tâche de fond et rend la main. Il ne suffit
donc pas de fermer le terminal pour l'arrêter :

```bash
astro dev status   # un serveur tourne-t-il, et sur quel port
astro dev logs     # ses journaux
astro dev stop     # l'arrêter
```

Un serveur oublié sur un ancien port sert du code périmé et fait perdre du
temps en débogage.

## Commandes

```bash
npm run dev          # serveur de développement
npm run build        # build (lance check-copy en pre-build)
npm run preview      # aperçu du build
npm run check        # astro check (types)
npm run verif:copy   # contrôle de conformité seul
npm run verif:copy -- --strict   # + échoue s'il reste des [À CONFIRMER]
```

`node scripts/generer-images.mjs` régénère favicon PNG, icône Apple, logo et
image Open Graph.

## Avant toute mise en ligne

```bash
npm run verif:copy -- --strict
```

Cette commande échoue tant qu'il reste une information à confirmer. La liste
qu'elle affiche **est** la checklist de la phase 0 du backlog : mentions
légales, tarif, format du programme, témoignages, coordonnées, médiateur.

Sans mentions légales valides, le site est en infraction dès la première
visite : c'est un bloquant absolu, pas un détail de finition.

## Écarts assumés par rapport à la spec

Documentés en commentaire à l'endroit concerné :

- **Palette** : papier crème / doré / sauge, alignée sur l'identité déjà
  installée sur Instagram, à la place du bleu de bloc de `spec/05`. L'argument
  de la spec contre le beige visait le « template infopreneur » ; il ne tient
  pas ici, où tout le trafic vient de la bio Instagram, une rupture
  chromatique à l'arrivée se lit comme un changement d'entreprise. La sobriété
  du positionnement est tenue par la mise en page et le ton, pas par la teinte.
  Tokens renommés en conséquence : `encre-*`, `papier-*`, `or-*`, `sauge-400`.
- **Pas de police script**, malgré sa présence sur les visuels Instagram : la
  cible lit sur téléphone, en fin de garde. Un script décoratif est le seul
  élément de cette DA qui coûte de la lisibilité, et c'est aussi celui qui
  signale le plus le template. À rouvrir si le client y tient, en accent unique.
- **Agenda** : `Agenda.astro` accepte Calendly et Cal.com et déduit le
  fournisseur de l'URL. La bio Instagram pointe vers Calendly, là où `spec/06`
  prévoyait Cal.com.
- **`/rdv` propose deux chemins** : l'agenda embarqué (chargé au clic) et un
  formulaire de rappel natif. L'audience arrive par le navigateur intégré
  d'Instagram, où les iframes tierces sont peu fiables.
- `--text-display` plafonné à `3rem` au lieu de `4.25rem`
  (`src/styles/global.css`), à la valeur d'origine, le H1 tient sur six
  lignes et repousse le CTA principal sous la ligne de flottaison.
- La grille de roulement du hero se déplie en bande mensuelle de 28 colonnes
  sur desktop, et se replie en deux semaines de 7 colonnes sous 768px
  (`src/components/planning/PlanningGrid.astro`).
- Le CTA secondaire du hero est un lien souligné, pas un bouton : deux boutons
  de poids égal ne tiennent pas sur sept colonnes et se concurrencent.
- `image.formats` retiré d'`astro.config.mjs` : la clé n'existe pas en Astro 5.
- La mention « à 5 000 € » du récit d'Oumaya (spec/04 §5) est supprimée : c'est
  le seul montant en euros du corpus, et il déclenchait la règle de recette.
