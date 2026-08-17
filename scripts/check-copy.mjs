/**
 * Garde-fou de conformité, exécuté avant chaque build (`npm run prebuild`).
 *
 * Deux niveaux :
 *   - par défaut, échoue sur toute formulation interdite par
 *     spec/02-conformite.md (promesse de revenu, multiple, délai de résultat,
 *     rareté artificielle, promesse de placement) ;
 *   - avec `--strict`, échoue en plus s'il reste des informations à confirmer.
 *     C'est le mode à utiliser pour un build de production.
 *
 *   node scripts/check-copy.mjs
 *   node scripts/check-copy.mjs --strict
 */
import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');

const DOSSIERS = ['src', 'public'];
const EXTENSIONS = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.txt']);
const IGNORES = new Set(['node_modules', 'dist', '.vercel', '.astro', 'fonts']);

/**
 * Formulations interdites. `contexte` explique pourquoi, pour que le message
 * d'erreur soit exploitable sans rouvrir la spec.
 */
const INTERDITS = [
  {
    nom: 'montant en euros',
    motif: /\d[\d\s.,]*\s?(€|euros?\b|k€|K€)/i,
    contexte:
      'Aucun chiffre de revenu ni de prix en dur. Le tarif vient de src/data/site.ts.',
  },
  {
    nom: 'multiple de revenu',
    motif: /\b(doubler|tripler|quadrupler|décupler)\b/i,
    contexte: 'Interdiction absolue (spec/02 §1).',
  },
  {
    nom: 'garantie de résultat',
    motif: /\bgaranti(e|s|es)?\b/i,
    contexte: 'Rien ne peut être garanti : ni mission, ni contrat, ni revenu.',
  },
  {
    nom: 'promesse de placement',
    motif: /\bplacement\s+(assuré|garanti|immédiat)/i,
    contexte: "L'activité de placement est encadrée (spec/02 §2).",
  },
  {
    nom: 'délai de résultat',
    motif: /\ben\s+\d+\s?(jours?|semaines?|mois)\b/i,
    contexte: 'Aucun délai de résultat annoncé (spec/02 §1).',
  },
  {
    nom: 'rareté artificielle',
    motif:
      /(compte à rebours|plus que \d+ places?|dernières places|offre valable|valable 24\s?h|places? restantes?)/i,
    contexte: 'Aucune pression temporelle (spec/02 §9).',
  },
  {
    nom: 'revenu moyen',
    motif: /revenus?\s+(moyens?|garantis?)/i,
    contexte: 'Aucune moyenne de revenu, même prudente.',
  },
  {
    nom: 'éligibilité CPF affirmée',
    motif: /(éligible|finançable)\s+(au|par le)\s+CPF(?!\s*\?)/i,
    contexte: 'La réponse CPF est non, sans ambiguïté.',
    // Les formulations négatives sont couvertes par la liste ci-dessous.
  },
];

/**
 * Formulations qui déclenchent une règle ci-dessus mais sont validées.
 * Toute nouvelle occurrence doit être ajoutée ici sciemment, ce qui force
 * une relecture au lieu d'un contournement silencieux.
 */
const AUTORISES = [
  // spec/04-copy.md §8, « ce que ce n'est pas ». Le mot « garanti » est ici
  // dans une phrase qui refuse la garantie, pas qui la promet.
  'revenu garanti le mois prochain',
  'pas éligible au CPF',
  // FAQ : la question est posée, la réponse est non (spec/02 §3).
  'éligible au CPF ou à France Travail',
  // CGV : intitulé d'un article qui écarte toute garantie de résultat.
  'Absence de garantie de résultat',
  // Le garde-fou lui-même cite les motifs qu'il interdit.
  'scripts/check-copy.mjs',
];

const A_CONFIRMER = /\[À CONFIRMER[^\]]*\]|<AConfirmer\b/;

async function* fichiers(dossier) {
  let entrees;
  try {
    entrees = await readdir(dossier, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entree of entrees) {
    if (IGNORES.has(entree.name)) continue;
    const chemin = join(dossier, entree.name);
    if (entree.isDirectory()) {
      yield* fichiers(chemin);
    } else if (EXTENSIONS.has(extname(entree.name))) {
      yield chemin;
    }
  }
}

const violations = [];
const aCompleter = [];
let fichiersLus = 0;

for (const dossier of DOSSIERS) {
  for await (const chemin of fichiers(resolve(racine, dossier))) {
    const relatif = relative(racine, chemin);
    if (AUTORISES.some((extrait) => relatif.includes(extrait))) continue;

    const contenu = await readFile(chemin, 'utf8');
    fichiersLus += 1;
    const lignes = contenu.split('\n');

    lignes.forEach((ligne, index) => {
      const numero = index + 1;

      for (const regle of INTERDITS) {
        const trouve = ligne.match(regle.motif);
        if (!trouve) continue;
        if (AUTORISES.some((extrait) => ligne.includes(extrait))) continue;
        violations.push({
          fichier: relatif,
          ligne: numero,
          regle: regle.nom,
          contexte: regle.contexte,
          extrait: ligne.trim().slice(0, 140),
        });
      }

      if (A_CONFIRMER.test(ligne)) {
        aCompleter.push({
          fichier: relatif,
          ligne: numero,
          extrait: ligne.trim().slice(0, 140),
        });
      }
    });
  }
}

// Contrôle spécifique aux témoignages : aucun montant, aucun chiffre.
const MONTANT_TEMOIGNAGE = /\d+\s?(€|euros?|k€|K€)/i;
for await (const chemin of fichiers(resolve(racine, 'src/content/temoignages'))) {
  const contenu = await readFile(chemin, 'utf8');
  if (MONTANT_TEMOIGNAGE.test(contenu)) {
    violations.push({
      fichier: relative(racine, chemin),
      ligne: 0,
      regle: 'montant dans un témoignage',
      contexte: 'Aucun montant dans un témoignage, même flouté (spec/02 §4).',
      extrait: '',
    });
  }
}

console.log(`Conformité : ${fichiersLus} fichiers analysés.`);

if (violations.length > 0) {
  console.error('\n✖ Formulations interdites détectées :\n');
  for (const violation of violations) {
    console.error(`  ${violation.fichier}:${violation.ligne} · ${violation.regle}`);
    console.error(`    ${violation.contexte}`);
    if (violation.extrait) console.error(`    › ${violation.extrait}`);
  }
  console.error(
    '\nCorriger, ou ajouter la formulation à AUTORISES dans scripts/check-copy.mjs après relecture de spec/02-conformite.md.\n'
  );
  process.exit(1);
}

console.log('✔ Aucune formulation interdite.');

if (aCompleter.length > 0) {
  const entete = strict
    ? '\n✖ Informations à confirmer, bloquantes en production :\n'
    : `\n⚠ ${aCompleter.length} information(s) à confirmer avant mise en ligne :\n`;
  console[strict ? 'error' : 'warn'](entete);
  for (const item of aCompleter) {
    console[strict ? 'error' : 'warn'](`  ${item.fichier}:${item.ligne} · ${item.extrait}`);
  }
  if (strict) {
    console.error(
      "\nRenseigner src/data/site.ts et les contenus concernés, puis relancer.\n"
    );
    process.exit(1);
  }
  console.warn(
    "\nBuild autorisé : ces éléments sont visibles sur le site et signalés comme tels.\n" +
      'Avant la mise en ligne, exécuter : npm run verif:copy -- --strict\n'
  );
}
