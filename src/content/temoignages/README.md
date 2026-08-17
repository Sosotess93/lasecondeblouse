# Témoignages

Un fichier JSON par témoignage. **Aucun témoignage inventé, même en
placeholder de développement** (cf. `spec/02-conformite.md` §4).

Le schéma impose `"accordEcrit": true` : un témoignage sans accord écrit
archivé fait échouer le build. `scripts/check-copy.mjs` refuse en plus tout
montant en euros dans ce dossier.

Modèle :

```json
{
  "prenom": "Camille",
  "initiale": "R",
  "ancienneFonction": "infirmière",
  "service": "médecine interne",
  "promotion": "mars 2025",
  "citation": "Ses mots à elle, sans lissage, sans montant.",
  "accordEcrit": true,
  "miseEnAvant": true
}
```

Champs facultatifs : `service`, `videoUrl`, `contrepartie` (à renseigner si le
témoignage a été obtenu contre une remise ou une commission d’affiliation).
