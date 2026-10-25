#!/usr/bin/env node
// One-shot bootstrap for a project created from this template: fills in the placeholders, refreshes the lockfile
// (it embeds the package name) and removes itself. Run `corepack enable` first so `yarn` resolves.
//
//   node scripts/init.mjs                                  prompts for each answer
//   node scripts/init.mjs --name my-app --author "Jane Doe" [--year 2026]
//   flags: --no-install (skip `yarn install`), --keep (keep this script), --dry-run (write nothing), --help
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync, rmdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

/** Valid npm package name: lowercase, URL-safe, optional @scope/ prefix. */
const NAME_PATTERN = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

/** Files that carry placeholders, relative to the project root. */
export const FILES = ['package.json', 'CLAUDE.md', 'LICENSE', 'CHANGELOG.md'];

const HELP = `Usage: node scripts/init.mjs [--name <npm-name>] [--author <holder>] [--year <yyyy>] [--no-install] [--keep] [--dry-run]

Fills in {{PROJECT_NAME}} (package.json, CLAUDE.md), the LICENSE copyright line and {{RELEASE_DATE}} (CHANGELOG.md),
runs \`yarn install\` to refresh yarn.lock, then deletes this script. Missing answers are prompted for on a terminal and
required as flags otherwise.`;

/**
 * @param {{ name?: string, author?: string, year?: string }} answers
 * @returns {string[]} Problems with the answers; empty when they are usable.
 */
export function validate({ name, author, year }) {
    const problems = [];
    if (!name || name.length > 214 || !NAME_PATTERN.test(name)) {
        problems.push(`name "${name ?? ''}" is not a valid npm package name (lowercase letters, digits, - . _ ~; optional @scope/ prefix)`);
    }
    if (!author || /[\r\n]/.test(author)) {
        problems.push('author must be a single non-empty line');
    }
    if (!/^\d{4}$/.test(year ?? '')) {
        problems.push(`year "${year ?? ''}" must be four digits`);
    }
    return problems;
}

/**
 * Applies the answers to the template files.
 * @param {Record<string, string>} files Path to content, for every entry of FILES.
 * @param {{ name: string, author: string, year: string, date: string }} values `date` is the YYYY-MM-DD release date.
 * @returns {Record<string, string>} The same paths with the placeholders filled in.
 */
export function fillPlaceholders(files, { name, author, year, date }) {
    if (!files['package.json'].includes('{{PROJECT_NAME}}')) {
        throw new Error('package.json has no {{PROJECT_NAME}} placeholder: this project is already initialised');
    }
    // Function replacers keep `$&`-style sequences in the answers literal.
    const projectName = () => name;
    return {
        'package.json': files['package.json'].replaceAll('{{PROJECT_NAME}}', projectName),
        // The "Template repo" note describes the template, not the new project, so it goes.
        'CLAUDE.md': files['CLAUDE.md']
            .replace(/^> \*\*Template repo\.\*\*.*(?:\n>.*)*\n\n/m, '')
            .replaceAll('{{PROJECT_NAME}}', projectName),
        LICENSE: files.LICENSE.replace(/^Copyright \(c\) .*$/m, () => `Copyright (c) ${year} ${author}`),
        'CHANGELOG.md': files['CHANGELOG.md'].replaceAll('{{RELEASE_DATE}}', () => date),
    };
}

/** Package name suggested from the directory name. */
function defaultName(root) {
    return basename(root)
        .toLowerCase()
        .replace(/[^a-z0-9-._~]+/g, '-')
        .replace(/^[._]+/, '')
        .replace(/-+$/, '');
}

function gitUserName() {
    const result = spawnSync('git', ['config', 'user.name'], { encoding: 'utf8' });
    return result.status === 0 ? result.stdout.trim() : '';
}

async function ask(rl, question, fallback) {
    const answer = (await rl.question(fallback ? `${question} [${fallback}]: ` : `${question}: `)).trim();
    return answer || fallback;
}

/**
 * @param {string[]} argv Arguments after the script name.
 * @param {string} root Project root.
 * @returns {Promise<number>} Process exit code.
 */
export async function main(argv, root) {
    const { values: options } = parseArgs({
        args: argv,
        options: {
            name: { type: 'string' },
            author: { type: 'string' },
            year: { type: 'string' },
            'no-install': { type: 'boolean' },
            keep: { type: 'boolean' },
            'dry-run': { type: 'boolean' },
            help: { type: 'boolean', short: 'h' },
        },
    });
    if (options.help) {
        console.log(HELP);
        return 0;
    }

    const thisYear = String(new Date().getFullYear());
    const rl = process.stdin.isTTY && process.stdout.isTTY ? createInterface({ input: process.stdin, output: process.stdout }) : null;
    let answers;
    try {
        answers = {
            name: options.name ?? (rl ? await ask(rl, 'Package name', defaultName(root)) : undefined),
            author: options.author ?? (rl ? await ask(rl, 'Copyright holder', gitUserName()) : undefined),
            year: options.year ?? (rl ? await ask(rl, 'Copyright year', thisYear) : thisYear),
        };
    } finally {
        rl?.close();
    }

    const problems = validate(answers);
    if (problems.length > 0) {
        for (const problem of problems) {
            console.error(`init: ${problem}`);
        }
        console.error('init: pass --name and --author, or run on a terminal to be prompted (see --help)');
        return 1;
    }

    const files = Object.fromEntries(FILES.map((file) => [file, readFileSync(join(root, file), 'utf8')]));
    let updated;
    try {
        updated = fillPlaceholders(files, { ...answers, date: new Date().toISOString().slice(0, 10) });
    } catch (error) {
        console.error(`init: ${error.message}`);
        return 1;
    }
    const changed = FILES.filter((file) => updated[file] !== files[file]);

    if (options['dry-run']) {
        console.log(`init: would update ${changed.join(', ')}`);
        return 0;
    }
    for (const file of changed) {
        writeFileSync(join(root, file), updated[file]);
    }
    console.log(`init: updated ${changed.join(', ')}`);

    if (options['no-install']) {
        console.log('init: skipped `yarn install`; run it before any other yarn command, as yarn.lock still has the old package name');
    } else {
        const install = spawnSync('yarn', ['install'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
        if (install.status !== 0) {
            console.warn('init: `yarn install` failed; run it yourself to refresh yarn.lock, which embeds the package name');
        }
    }
    if (!options.keep) {
        const scripts = join(root, 'scripts');
        for (const file of ['init.mjs', 'init.test.mts']) {
            rmSync(join(scripts, file), { force: true });
        }
        try {
            rmdirSync(scripts);
        } catch {
            // Other files live in scripts/; leave the directory alone.
        }
        console.log('init: removed scripts/init.mjs');
    }
    console.log('init: next, describe the project in CLAUDE.md, check SECURITY.md names a real reporting channel, and replace README.md');
    return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    process.exitCode = await main(process.argv.slice(2), resolve(dirname(fileURLToPath(import.meta.url)), '..'));
}
