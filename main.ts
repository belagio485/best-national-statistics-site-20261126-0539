// NusaAngka hand-in program.
//
// Copies the static site (app/) and its screenshots (screenshots/) from this
// repository into the output directory, then writes dossier.json there with
// the kit's buildDossier so the grader can compare it byte for byte.
//
// Run locally with:  MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader the output directory is /output.

import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function handInSite(): void {
  // Start from a clean output tree so two runs write identical bytes:
  // stale files from an earlier run must never leak into the dossier.
  mkdirSync(outDir, { recursive: true });
  rmSync(join(outDir, 'app'), { recursive: true, force: true });
  rmSync(join(outDir, 'screenshots'), { recursive: true, force: true });
  rmSync(join(outDir, 'dossier.json'), { force: true });
  cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });
  cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
    app_path_max_bytes: 1000,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
}

handInSite();
