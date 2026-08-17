/**
 * Génère les images statiques dérivées de l'identité : favicon PNG, icône
 * Apple, logo carré et image Open Graph par défaut.
 *
 * Lancer après toute modification des couleurs ou du motif :
 *   node scripts/generer-images.mjs
 *
 * L'image OG reste une image de repli. Dès qu'une photo d'Oumaya est
 * disponible, produire une OG par page principale (cf. spec/08-seo-geo.md).
 */
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = resolve(racine, 'public');

const ENCRE_900 = '#2A2219';
const ENCRE_700 = '#4B4136';
const PAPIER_50 = '#FBF9F3';
const PAPIER_100 = '#F2EDE2';
const PAPIER_200 = '#E3DACA';
const OR = '#A98A4F';
const OR_600 = '#8B6E38';

const marque = (taille) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${taille}" height="${taille}" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${ENCRE_900}"/>
  <rect x="7.5" y="7.5" width="17" height="17" rx="2" fill="none" stroke="${PAPIER_50}" stroke-width="2"/>
  <path d="M11 21 21 11" stroke="${OR}" stroke-width="2.5" stroke-linecap="square"/>
</svg>`;

/** Bande de roulement reprise du hero, en fond de l'image OG. */
function bandeRoulement() {
  const roulement = [
    'M', 'M', 'S', 'S', 'RH', 'RH', 'N',
    'N', 'RH', 'RH', 'M', 'M', 'S', 'S',
    'RH', 'M', 'M', 'RH', 'N', 'N', 'RH',
    'M', 'S', 'S', 'RH', 'N', 'N', 'RH',
  ];
  const cellule = 34;
  const espace = 4;
  const separationSemaine = 10;
  const y = 430;
  let x = 80;

  return roulement
    .map((poste, index) => {
      if (index > 0 && index % 7 === 0) x += separationSemaine;
      const gauche = x;
      x += cellule + espace;
      const libere = index >= 14;
      const fond = libere ? 'none' : poste === 'RH' ? PAPIER_200 : ENCRE_700;
      const trait = libere ? OR : 'none';
      const pointilles = libere ? ' stroke-dasharray="3 3"' : '';
      const encreTexte = poste === 'RH' ? ENCRE_700 : PAPIER_100;
      const texte = libere
        ? ''
        : `<text x="${gauche + cellule / 2}" y="${y + cellule / 2 + 5}" font-family="monospace" font-size="14" fill="${encreTexte}" text-anchor="middle">${poste}</text>`;
      return `<rect x="${gauche}" y="${y}" width="${cellule}" height="${cellule}" rx="2" fill="${fond}" stroke="${trait}" stroke-width="1.5"${pointilles}/>${texte}`;
    })
    .join('');
}

/**
 * Image Open Graph.
 *
 * Le logo de marque est composité par-dessus quand `src/assets/logo.*` existe.
 * Sinon on retombe sur la marque géométrique, pour que le script reste
 * exécutable sur une machine qui n'a pas encore le fichier.
 */
const logoSource = ['logo.png', 'logo.svg', 'logo.webp', 'logo.jpg']
  .map((nom) => resolve(racine, 'src/assets', nom))
  .find((chemin) => existsSync(chemin));

const marqueDeRepli = `
  <g transform="translate(80, 86)">
    <rect x="0" y="0" width="40" height="40" rx="3" fill="none" stroke="${ENCRE_900}" stroke-width="2.5"/>
    <path d="M9 31 31 9" stroke="${OR}" stroke-width="3" stroke-linecap="square"/>
    <text x="58" y="29" font-family="Georgia, serif" font-size="27" fill="${ENCRE_900}">La Seconde Blouse</text>
  </g>`;

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPIER_50}"/>
  ${bandeRoulement()}
  ${logoSource ? '' : marqueDeRepli}
  <text x="80" y="285" font-family="Georgia, serif" font-size="54" fill="${ENCRE_900}">Votre métier vous a appris</text>
  <text x="80" y="348" font-family="Georgia, serif" font-size="54" fill="${OR_600}">à écouter quelqu’un qui va mal.</text>
  <text x="80" y="392" font-family="sans-serif" font-size="23" fill="${ENCRE_700}">Programme de reconversion pour les professionnels de santé</text>
</svg>`;

await mkdir(publicDir, { recursive: true });

await sharp(Buffer.from(marque(512)))
  .png()
  .toFile(resolve(publicDir, 'logo.png'));

await sharp(Buffer.from(marque(180)))
  .png()
  .toFile(resolve(publicDir, 'apple-touch-icon.png'));

let og_ = sharp(Buffer.from(og));

if (logoSource) {
  const logo = await sharp(logoSource)
    .resize({ width: 430, fit: 'inside' })
    .png()
    .toBuffer();
  og_ = sharp(await og_.png().toBuffer()).composite([
    { input: logo, top: 52, left: 66 },
  ]);
}

await og_.png().toFile(resolve(publicDir, 'og-default.png'));

/**
 * Image de partage de /oumaya : l'illustration du passage, recadrée au format
 * Open Graph. Le sujet est décalé à gauche dans l'original, on cadre au centre
 * pour garder les deux moments.
 */
const passage = resolve(racine, 'src/assets/oumaya-passage.jpg');

if (existsSync(passage)) {
  await sharp(passage)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .flatten({ background: PAPIER_50 })
    // JPEG et non PNG : l'illustration est un aplat de dégradés, le PNG la
    // sort à plus d'un mégaoctet pour un gain visuel nul.
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(resolve(publicDir, 'og-oumaya.jpg'));
}

console.log(
  'Images générées : logo.png, apple-touch-icon.png, og-default.png' +
    (existsSync(passage) ? ', og-oumaya.jpg' : '')
);
