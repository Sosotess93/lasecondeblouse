# Informations à obtenir d'Oumaya

62 éléments manquants, listés par `npm run verif:copy -- --strict`. Tant qu'il
en reste un, cette commande échoue et le site n'est pas publiable.

Ils ne sont pas de même poids. Les six premiers groupes sont **bloquants** :
sans eux, le site est en infraction dès la première visite. Les autres sont des
trous visibles, gênants mais pas illégaux.

---

## 1. Identité de l'éditeur — bloquant

Obligatoire (LCEN art. 6). Aujourd'hui la page `/mentions-legales` affiche des
cases vides à la place.

- [ ] Raison sociale
- [ ] Forme juridique (SASU, EI, micro-entreprise…)
- [ ] Capital social, si société
- [ ] SIREN
- [ ] Adresse du siège
- [ ] Nom complet de la directrice de la publication
- [ ] **Pays d'établissement** — le numéro de contact est tunisien. Ce point
      décide de la rédaction des mentions légales, des CGV, du régime de TVA
      et de l'obligation d'adhérer à un médiateur. À trancher en premier.

→ `src/data/site.ts`, objet `editrice`

## 2. Médiateur de la consommation — bloquant

Obligatoire pour tout professionnel vendant à des consommateurs (art. L616-1),
si l'établissement est en France.

- [ ] Nom du médiateur
- [ ] URL de sa plateforme
- [ ] Adresse postale

→ `src/data/site.ts`, objet `mediateur`

## 3. Tarif — bloquant commercialement

Le prix affiché sans avoir à appeler est un choix stratégique de la spec, pas
un détail. La section transparence affiche un espace vide à sa place.

- [ ] Montant TTC du programme
- [ ] Nombre d'échéances en paiement échelonné
- [ ] Montant par échéance
- [ ] **Attention** : au-delà de trois échéances, ou en présence de frais,
      l'opération peut relever du crédit à la consommation. À valider.

→ `src/data/site.ts`, objet `tarif`

## 4. Statut de formation — bloquant

- [ ] Numéro de déclaration d'activité, si déclarée
- [ ] Certification Qualiopi : oui ou non
- [ ] Enregistrement RNCP : oui ou non

Si l'une des deux dernières réponses est oui, la réponse CPF de la FAQ et des
CGV doit être entièrement réécrite.

→ `src/data/site.ts`, objet `editrice`

## 5. Coordonnées et hébergement — bloquant

- [ ] Adresse e-mail dédiée aux données personnelles (ex. `donnees@…`)
- [ ] Numéro de téléphone définitif (le `+216` actuel est provisoire)
- [ ] Nom de domaine définitif
- [ ] Hébergeur retenu, son adresse et son téléphone
- [ ] Prestataire de paiement, et sa localisation

→ `src/data/site.ts`, objets `contact`, `site`, `hebergeur` ; `/confidentialite`

## 6. CGV — bloquant, et à faire relire

Neuf mentions manquantes dans le document. Il décrit un engagement contractuel
et doit être relu par un juriste avant publication.

- [ ] Durée, format et modalités d'accès de la prestation
- [ ] Tarif TTC et échelonnement
- [ ] Coordonnées complètes pour l'exercice du droit de rétractation
- [ ] Médiateur de la consommation

→ `src/pages/cgv.astro`

---

## 7. Contenu du programme — visible

Ces champs s'affichent en vide sur la page programme.

- [ ] Durée en semaines
- [ ] Format (modules en ligne, nombre de sessions live par semaine)
- [ ] Taille des groupes
- [ ] Durée d'accès aux contenus
- [ ] Volume horaire hebdomadaire (repris dans la FAQ)

→ `src/data/site.ts`, objet `programme` ; `src/content/faq/03-temps-par-semaine.json`

## 8. Parcours d'Oumaya — visible

La page `/oumaya` attend son récit. Le texte actuel est une trame avec des
trous apparents.

- [ ] Nombre d'années d'exercice
- [ ] Service ou spécialité
- [ ] Délai entre la formation et la démission
- [ ] Récit long : ce qui a déclenché la décision, les premiers appels, les
      erreurs. Ses mots, sans lissage, sans aucun chiffre de revenu.

→ `src/components/sections/Oumaya.astro`, `src/pages/oumaya.astro`

## 9. Témoignages — section vide

- [ ] 3 à 6 témoignages, chacun avec accord écrit signé et archivé
- [ ] Pour chacun : prénom, initiale, ancienne fonction, service, date de
      promotion
- [ ] Aucun montant, aucun chiffre de revenu
- [ ] Mentionner toute contrepartie (remise, affiliation)

La section affiche un bloc neutre en attendant. Le schéma de validation refuse
tout témoignage sans accord écrit : le build échoue.

→ `src/content/temoignages/`

## 10. Le guide — page incomplète

- [ ] Nombre de pages du guide
- [ ] Le fichier PDF lui-même, ou la décision de le produire

→ `src/pages/guide/index.astro`

## 11. Agenda et réseaux — fonctionnalité inactive

- [ ] URL Calendly définitive (la bio Instagram pointe vers
      `calendly.com/contact-lasecondeblouse/30min`, à confirmer)
- [ ] Compte TikTok, s'il existe
- [ ] Clés Brevo, pour que le formulaire du guide fonctionne

→ `.env`, `src/data/site.ts`, objet `reseaux`

## 12. Image — visible

- [ ] Tranche d'âge observée parmi les participantes, si elle est connue
      (question de la FAQ, sinon supprimer la mention)

→ `src/content/faq/07-age.json`

---

## Vérifier l'avancement

```bash
npm run verif:copy -- --strict
```

La commande liste ce qui reste et sort en erreur tant que la liste n'est pas
vide. Quand elle passe, le site est publiable.
