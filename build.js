#!/usr/bin/env node
/* ParkKo build — compile src/app.jsx ahead of time and inline it into
   index.html, then drop the 2.8MB in-browser Babel bundle.
   Result: ~600KB single file that paints instantly instead of compiling
   JSX on every load. Edit src/app.jsx (never the compiled block in
   index.html), then run: node build.js */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const HTML = path.join(ROOT, 'index.html');
const JSX = path.join(ROOT, 'src', 'app.jsx');

// Babel is only needed at build time; pull it from the current index.html's
// own bundle so the build has zero npm dependencies.
function loadBabel(html) {
  const vm = require('vm');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const babelSrc = scripts.find(s => s.includes('transformSync') && s.includes('Babel'));
  if (!babelSrc) throw new Error('Babel bundle not found in index.html — cannot compile.');
  const sandbox = { self: {}, window: {}, globalThis: {} };
  const ctx = vm.createContext(sandbox);
  vm.runInContext('var globalThis=this;' + babelSrc, ctx, { timeout: 60000 });
  return sandbox.Babel || sandbox.globalThis.Babel;
}

const html = fs.readFileSync(HTML, 'utf8');
const jsx = fs.readFileSync(JSX, 'utf8');

const Babel = loadBabel(html);
// preset-react ONLY. Not preset-env: the app uses native async/await and we
// target current mobile browsers — env would pull in regenerator-runtime.
const { code } = Babel.transform(jsx, { presets: ['react'], compact: false });

let out = html;

// 1. Replace the babel-typed app block with a plain compiled script.
out = out.replace(
  /<script type="text\/babel"[^>]*>[\s\S]*?<\/script>/,
  '<script>\n' + code + '\n</script>'
);

// 2. Delete the Babel standalone bundle + its sourceMappingURL comment.
out = out.replace(
  /<script>\s*!function\([^)]*\)\{[^]*?Babel=\{\}[\s\S]*?<\/script>\s*/,
  ''
);
out = out.replace(/\/\/# sourceMappingURL=babel\.min\.js\.map\s*/g, '');

fs.writeFileSync(HTML, out);

const before = Buffer.byteLength(html);
const after = Buffer.byteLength(out);
console.log(`compiled ${jsx.split('\n').length} lines of JSX`);
console.log(`index.html: ${(before / 1048576).toFixed(2)}MB -> ${(after / 1048576).toFixed(2)}MB`);
if (out.includes('text/babel')) console.log('WARNING: text/babel still present');
if (out.includes('transformSync')) console.log('WARNING: Babel bundle still present');
