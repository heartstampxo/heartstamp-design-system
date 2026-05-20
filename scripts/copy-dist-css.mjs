import { cpSync, mkdirSync } from 'fs';

mkdirSync('dist/css', { recursive: true });
cpSync('src/css', 'dist/css', { recursive: true });

console.log('✓ Copied src/css → dist/css');
