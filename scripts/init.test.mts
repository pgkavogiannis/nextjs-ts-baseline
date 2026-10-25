// @vitest-environment node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { FILES, fillPlaceholders, validate } from './init.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file: string) => readFileSync(join(root, file), 'utf8');

// After `init` has run with --keep the placeholders are gone, so the template-file checks no longer apply.
const isTemplate = read('package.json').includes('{{PROJECT_NAME}}');
const values = { name: 'my-app', author: 'Jane Doe', year: '2030', date: '2030-01-31' };

describe('validate', () => {
    test('accepts usable answers', () => {
        expect(validate({ name: 'my-app', author: 'Jane Doe', year: '2030' })).toEqual([]);
        expect(validate({ name: '@acme/web.app', author: 'Acme Ltd.', year: '1999' })).toEqual([]);
    });

    test.each(['', 'My App', 'UPPER', '_hidden', '.dot', '@scope/', 'a/b', 'x'.repeat(215)])('rejects the package name %j', (name) => {
        expect(validate({ name, author: 'Jane Doe', year: '2030' })).toHaveLength(1);
    });

    test('rejects a missing or multi-line author and a malformed year', () => {
        expect(validate({ name: 'my-app', author: '', year: '2030' })).toHaveLength(1);
        expect(validate({ name: 'my-app', author: 'Jane\nDoe', year: '2030' })).toHaveLength(1);
        expect(validate({ name: 'my-app', author: 'Jane Doe', year: '30' })).toHaveLength(1);
        expect(validate({})).toHaveLength(3);
    });
});

// skipIf still runs the describe body, so read and fill lazily: once the placeholders are gone, filling would throw.
const templateFiles = () => Object.fromEntries(FILES.map((file) => [file, read(file)]));

describe.skipIf(!isTemplate)('fillPlaceholders on the template files', () => {
    test('leaves no placeholder behind', () => {
        const result = fillPlaceholders(templateFiles(), values);
        for (const file of FILES) {
            expect(result[file], file).not.toMatch(/\{\{(PROJECT_NAME|RELEASE_DATE|YEAR|AUTHOR|SECURITY_EMAIL)\}\}/);
        }
    });

    test('sets a valid package name in package.json', () => {
        const result = fillPlaceholders(templateFiles(), values);
        expect(JSON.parse(result['package.json']).name).toBe('my-app');
    });

    test('drops the template-repo note and names the project in CLAUDE.md', () => {
        const result = fillPlaceholders(templateFiles(), values);
        expect(result['CLAUDE.md']).not.toContain('Template repo');
        expect(result['CLAUDE.md']).toContain('my-app — describe what this project does');
        expect(result['CLAUDE.md']).toMatch(/^This file provides guidance[^\n]*\n\n## Project Overview\n/m);
    });

    test('rewrites only the copyright line of LICENSE', () => {
        const files = templateFiles();
        const result = fillPlaceholders(files, values);
        expect(result.LICENSE).toContain('Copyright (c) 2030 Jane Doe\n');
        expect(result.LICENSE.replace(/^Copyright .*$/m, '')).toBe(files.LICENSE.replace(/^Copyright .*$/m, ''));
    });

    test('dates the first release in CHANGELOG.md', () => {
        const result = fillPlaceholders(templateFiles(), values);
        expect(result['CHANGELOG.md']).toContain('## [0.1.0] - 2030-01-31');
    });

    test('keeps special replacement sequences in the answers literal', () => {
        const tricky = fillPlaceholders(templateFiles(), { ...values, name: 'a$&b', author: "O'Brien $1 & Co" });
        expect(tricky.LICENSE).toContain("Copyright (c) 2030 O'Brien $1 & Co\n");
        expect(tricky['CLAUDE.md']).toContain('a$&b — describe');
    });
});

test('refuses a project that is already initialised', () => {
    const files = Object.fromEntries(FILES.map((file) => [file, '']));
    files['package.json'] = '{ "name": "my-app" }';
    expect(() => fillPlaceholders(files, values)).toThrow(/already initialised/);
});
