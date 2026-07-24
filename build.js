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

// Babel is only needed at build time. It lives in vendor/babel.min.js — a
// committed build asset that index.html never references, so it costs users
// nothing. (Earlier this scraped the bundle out of index.html, which broke
// the moment the pre-compile step deleted that bundle from index.html.)
function loadBabel() {
  const vm = require('vm');
  const babelSrc = fs.readFileSync(path.join(ROOT, 'vendor', 'babel.min.js'), 'utf8');
  const sandbox = { self: {}, window: {}, globalThis: {} };
  const ctx = vm.createContext(sandbox);
  vm.runInContext('var globalThis=this;' + babelSrc, ctx, { timeout: 60000 });
  return sandbox.Babel || sandbox.globalThis.Babel;
}

const html = fs.readFileSync(HTML, 'utf8');
const jsx = fs.readFileSync(JSX, 'utf8');

const Babel = loadBabel();
// preset-react ONLY. Not preset-env: the app uses native async/await and we
// target current mobile browsers — env would pull in regenerator-runtime.
const { code } = Babel.transform(jsx, { presets: ['react'], compact: false });

let out = html;

// The compiled app is wrapped in stable markers so the build is idempotent:
// after the first run there's no more text/babel block, and re-running must
// still find and replace the app. We match the markers, or the original
// text/babel block on the very first build.
const APP_OPEN = '<!-- PARKKO_APP -->';
const APP_CLOSE = '<!-- /PARKKO_APP -->';
const compiledBlock = `${APP_OPEN}\n<script>\n${code}\n</script>\n${APP_CLOSE}`;

const markerRe = new RegExp(`${APP_OPEN}[\\s\\S]*?${APP_CLOSE}`);
const babelBlockRe = /<script type="text\/babel"[^>]*>[\s\S]*?<\/script>/;

if (markerRe.test(out)) {
  out = out.replace(markerRe, compiledBlock);
} else if (babelBlockRe.test(out)) {
  out = out.replace(babelBlockRe, compiledBlock);
} else {
  throw new Error('Could not find app block (markers or text/babel) in index.html.');
}

// First build only: strip the Babel standalone bundle + its sourcemap comment.
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
