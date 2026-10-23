#!/usr/bin/env node
/*
 * Docs-sync check: verifies the module-surface claims this website makes
 * against the live K8sAgentMesh main repo, so docs cannot silently drift.
 *
 * Claims live in src/data/main-repo-facts.json. The check runs in CI
 * (.github/workflows/docs-sync.yml and ci.yml). If it fails, either the
 * module moved (update the site docs) or the facts file is stale (update
 * src/data/main-repo-facts.json to match verified reality).
 *
 * Usage:
 *   node scripts/check-docs-sync.mjs
 *
 * Env:
 *   MAIN_REPO_PATH  use a local checkout instead of cloning the remote
 *   MAIN_REPO_URL   override the repo URL from the facts file
 *   MAIN_REPO_REF   override the branch (default: facts.mainRepoBranch)
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const facts = JSON.parse(
  readFileSync(join(siteRoot, 'src/data/main-repo-facts.json'), 'utf8'),
);

const repoUrl = process.env.MAIN_REPO_URL || facts.mainRepoUrl;
const repoRef = process.env.MAIN_REPO_REF || facts.mainRepoBranch || 'main';
const localPath = process.env.MAIN_REPO_PATH || null;

const results = [];
let failures = 0;

function check(name, fn) {
  try {
    fn();
    results.push(`ok   ${name}`);
  } catch (err) {
    failures++;
    results.push(`FAIL ${name}: ${err.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// --- Tags: checked against the remote refs, clone or not -----------------
check(`release tag(s) reachable on ${repoUrl}: ${facts.tags.join(', ')}`, () => {
  const out = execFileSync('git', ['ls-remote', '--tags', repoUrl], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  for (const tag of facts.tags) {
    assert(
      out.split('\n').some((l) => l.endsWith(`refs/tags/${tag}`)),
      `tag ${tag} not found on remote`,
    );
  }
});

// --- Source: local checkout or shallow clone ------------------------------
let repo = localPath;
let tmpClone = null;
if (!repo) {
  tmpClone = mkdtempSync(join(tmpdir(), 'k8sam-docs-sync-'));
  execFileSync(
    'git',
    ['clone', '--depth', '100', '--branch', repoRef, repoUrl, tmpClone],
    { stdio: 'pipe', maxBuffer: 16 * 1024 * 1024 },
  );
  repo = tmpClone;
}

try {
  // Files exist
  for (const rel of facts.files) {
    check(`file exists: ${rel}`, () => {
      assert(!!readFileSync(join(repo, rel)), `cannot read ${rel}`);
    });
  }

  // Content patterns
  for (const { file, pattern } of facts.contains) {
    check(`pattern in ${file}: ${JSON.stringify(pattern)}`, () => {
      const text = readFileSync(join(repo, file), 'utf8');
      assert(text.includes(pattern), `pattern not found`);
    });
  }

  // Extraction-clean: no module .go file imports the host. The grep anchors on
  // the quoted import string (`"github.com/...`) so doc comments that merely
  // mention the forbidden path (e.g. the module's own doc.go rule) don't
  // trip the check — only actual import statements do.
  check(`extraction-clean: no *.go imports ${facts.extractionCleanForbidden}`, () => {
    let out = '';
    try {
      out = execFileSync(
        'grep',
        ['-rn', '--include=*.go', `"${facts.extractionCleanForbidden}`, repo],
        { encoding: 'utf8', stdio: 'pipe' },
      ).trim();
    } catch (err) {
      out = (err.stdout || '').trim(); // grep exit 1 = no match = clean
    }
    assert(out === '', `forbidden host import found:\n${out}`);
  });

  // Story subjects: the P3 stories the site reports as done
  if (Array.isArray(facts.commitSubjects) && facts.commitSubjects.length > 0) {
    check(`commit subjects present on ${repoRef}: ${facts.commitSubjects.join(', ')}`, () => {
      const log = execFileSync('git', ['-C', repo, 'log', '--oneline'], {
        encoding: 'utf8',
        maxBuffer: 16 * 1024 * 1024,
      });
      for (const subj of facts.commitSubjects) {
        assert(log.includes(subj), `no commit subject mentions ${subj}`);
      }
    });
  }
} finally {
  if (tmpClone) rmSync(tmpClone, { recursive: true, force: true });
}

console.log(`docs-sync against ${localPath ? `local checkout ${localPath}` : repoUrl}`);
for (const line of results) console.log(line);
console.log(
  failures === 0
    ? `docs-sync: all ${results.length} claims verified`
    : `docs-sync: ${failures} of ${results.length} claims FAILED`,
);
process.exit(failures === 0 ? 0 : 1);
