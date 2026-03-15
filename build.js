import { execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🚀 Starting build process...\n');

// Clean docs directory
const docsDir = join(__dirname, 'docs');
if (existsSync(docsDir)) {
  console.log('📁 Cleaning docs directory...');
  rmSync(docsDir, { recursive: true, force: true });
}
mkdirSync(docsDir, { recursive: true });

// Build mdbook first
console.log('\n📖 Building mdbook...');
try {
  execSync('mdbook build', { stdio: 'inherit' });
  console.log('✅ mdbook built successfully!');
} catch (error) {
  console.error('❌ mdbook build failed');
  process.exit(1);
}

// Build React app
console.log('\n⚛️  Building React app...');
try {
  execSync('cd web && npm run build', { stdio: 'inherit' });
  console.log('✅ React app built successfully!');
} catch (error) {
  console.error('❌ React build failed');
  process.exit(1);
}

// Copy mermaid files to docs/notes
console.log('\n📋 Copying mermaid files...');
const mermaidFiles = ['mermaid.min.js', 'mermaid-init.js'];
for (const file of mermaidFiles) {
  const src = join(__dirname, file);
  const dest = join(__dirname, 'docs', 'notes', file);
  if (existsSync(src)) {
    copyFileSync(src, dest);
    console.log(`   Copied: ${file}`);
  }
}

console.log('\n✨ Build complete! Output in docs/');
console.log('   - React app: docs/index.html');
console.log('   - mdbook notes: docs/notes/');