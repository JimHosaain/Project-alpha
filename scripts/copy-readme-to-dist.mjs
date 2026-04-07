import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const sourcePath = resolve(root, 'README.md');
const destPath = resolve(root, 'dist', 'README.md');

const content = await readFile(sourcePath, 'utf8');
await mkdir(dirname(destPath), { recursive: true });
await writeFile(destPath, content, 'utf8');

console.log('Copied README.md to dist/README.md');
