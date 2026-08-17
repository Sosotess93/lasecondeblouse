# 09 — Tracking, formulaires et RGPD

## Principe

Le site collecte des données d'une population identifiable (professionnels de santé) sur un sujet qui touche à leur situation professionnelle et parfois à leur santé. Le champ « profession » n'est pas une donnée de santé au sens de l'article 9 du RGPD, mais le contexte impose de la rigueur : minimisation stricte, pas de revente, pas de partage publicitaire.

**Décision : aucun pixel publicitaire en v1.** Ni Meta Pixel, ni TikTok Pixel, ni Google Ads. Ils imposent un bandeau cookies bloquant, dégradent la performance, et transmettent à des tiers des données de navigation liées à une intention de reconversion. Si une campagne payante est lancée plus tard, les réintroduire de façon conditionnée au consentement, et mettre à jour la politique de confidentialité.

## Analytics

**Option retenue : PostHog auto-hébergé**, configuré sans cookie (`persistence: 'memory'`), ou **Plausible** si l'on veut zéro maintenance.

En configuration sans cookie et sans identifiant persistant, la mesure d'audience peut relever de l'exemption de consentement prévue par la CNIL, à condition que :
- la finalité soit strictement la mesure d'audience,
- les données ne soient pas recoupées avec d'autres traitements,
- les adresses IP soient tronquées ou non conservées,
- aucun suivi entre sites ne soit effectué.

Vérifier la configuration réelle contre les lignes directrices CNIL avant de retirer le bandeau. **En cas de doute, garder un bandeau** : le coût en conversion est marginal comparé au risque.

`[À CONFIRMER]` — arbitrage à valider avec Oumaya ou son conseil.

## Événements à suivre

Un seul listener global, sur `[data-evt]` :

```js
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-evt]');
  if (el) track(el.dataset.evt, { page: location.pathname });
});
```

| Événement | Déclencheur |
|---|---|
| `cta_hero` | Clic CTA principal du hero |
| `cta_header` | Clic bouton header |
| `cta_final` | Clic CTA de fin de page |
| `cal_ouvert` | Ouverture de l'embed Cal.com |
| `rdv_reserve` | Callback de confirmation Cal.com |
| `guide_soumis` | Formulaire lead magnet envoyé avec succès |
| `faq_ouverte` | Ouverture d'une question (avec son libellé) |
| `scroll_transparence` | Section transparence atteinte |
| `scroll_90` | 90 % de la page atteint |

`scroll_transparence` est le signal le plus utile du site : il mesure combien de visiteurs lisent le prix, et le taux de RDV parmi eux.

**Ne pas tracker :** le contenu saisi dans les champs, le mouvement de souris, les enregistrements de session. Les session replays sur une audience en difficulté professionnelle sont disproportionnés.

## Formulaire lead magnet

**Champs collectés :** prénom, e-mail, profession. Rien d'autre. Pas de téléphone (il sera demandé au moment du RDV), pas d'ancienneté, pas de « où en êtes-vous ? ».

**Consentement** — case non pré-cochée, formulation explicite :
> J'accepte de recevoir le guide et les e-mails de La Seconde Blouse. Désinscription en un clic à tout moment.

Le consentement à la newsletter et l'envoi du guide sont juridiquement liés ici (le guide est la contrepartie), ce qui est admis, mais la formulation doit rester claire sur les deux finalités.

**Anti-spam :** honeypot `societe` + horodatage de rendu (rejet si soumission < 2 s après chargement). Pas de CAPTCHA tiers en v1 : reCAPTCHA transmet des données à Google et ajoute un traceur.

**Traitement serveur** (`/api/lead`) :
1. Validation Zod (e-mail, longueur prénom, profession dans l'énumération)
2. Rejet si honeypot rempli — réponse 200 quand même, pour ne pas informer le bot
3. Création/mise à jour du contact Brevo, attributs `PRENOM` et `PROFESSION`
4. Ajout à la liste de séquence
5. Réponse `{ ok: true }`

Ne jamais logger l'adresse e-mail en clair dans les logs applicatifs.

## Prise de rendez-vous

Cal.com, chargé au clic uniquement. Le formulaire de réservation collecte nom, e-mail et téléphone — c'est le moment légitime pour le téléphone, puisque la prestation est un appel.

Ajouter deux champs sur le créneau Cal.com :
- Profession (select)
- « Avez-vous lu le tarif du programme sur le site ? » (oui / non)

Le second champ améliore la qualification et documente le fait que l'information tarifaire a été portée à connaissance avant l'appel — ce qui est utile en cas de contestation.

Confirmation par e-mail rappelant : durée, gratuité, absence d'engagement, et le fait qu'un programme payant sera présenté.

## Politique de confidentialité — contenu minimal

| Traitement | Finalité | Base légale | Conservation |
|---|---|---|---|
| Formulaire guide | Envoi du guide et de la séquence e-mail | Consentement | 3 ans sans interaction |
| Prise de RDV | Organisation de l'appel | Mesures précontractuelles | 3 ans |
| Mesure d'audience | Amélioration du site | Intérêt légitime / consentement | 13 mois max |
| Clients du programme | Exécution du contrat, obligations comptables | Contrat / obligation légale | 10 ans (comptable) |

Sous-traitants à lister nominativement : Brevo, Cal.com, l'hébergeur, l'outil d'analytics, le prestataire de paiement. Préciser leur localisation et, si hors UE, le mécanisme de transfert.

Droits à mentionner : accès, rectification, effacement, opposition, portabilité, limitation, retrait du consentement, réclamation auprès de la CNIL (avec le lien).

Adresse de contact dédiée : `donnees@[domaine]` `[À CONFIRMER]`

## Bandeau cookies

Si des traceurs soumis à consentement sont présents :
- Aucun dépôt avant action de l'utilisateur.
- « Refuser » aussi accessible et visuellement équivalent à « Accepter ». Pas de bouton gris contre un bouton coloré.
- Choix mémorisé 6 mois, retrait possible depuis `/cookies`.
- Pas de mur de cookies.

Implémentation maison de ~40 lignes plutôt qu'une CMP tierce : moins de poids, moins de dépendances, et un contrôle total sur le design.
