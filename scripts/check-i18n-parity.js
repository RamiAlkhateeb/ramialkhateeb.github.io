#!/usr/bin/env node
'use strict';
// Checks that js/site.js's TEXT.en and TEXT.ar objects have the same keys.
// Runs standalone (`node scripts/check-i18n-parity.js`) or as a Claude Code
// PostToolUse hook (reads the tool-call JSON payload from stdin and only
// acts when the edited file is js/site.js).
const fs = require('fs');
const path = require('path');

function extractObjectLiteral(src, marker) {
  const idx = src.indexOf(marker);
  if (idx === -1) return null;
  const start = src.indexOf('{', idx);
  if (start === -1) return null;
  let depth = 0, inStr = null, i = start;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(start, i);
}

function loadText(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const literal = extractObjectLiteral(src, 'const TEXT=');
  if (!literal) throw new Error('could not find `const TEXT=` object literal in ' + filePath);
  return new Function('return ' + literal)();
}

function diffKeys(a, b) {
  const setA = new Set(Object.keys(a));
  const setB = new Set(Object.keys(b));
  return {
    onlyA: [...setA].filter(k => !setB.has(k)),
    onlyB: [...setB].filter(k => !setA.has(k))
  };
}

function readHookPayload() {
  if (process.stdin.isTTY) return null;
  try {
    const raw = fs.readFileSync(0, 'utf8').trim();
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function resolveTargetFile(payload, cwd) {
  const fallback = path.join(cwd, 'js', 'site.js');
  if (!payload) return fallback;
  const filePath = payload.tool_input && payload.tool_input.file_path;
  if (!filePath) return fallback;
  return filePath.replace(/\\/g, '/').endsWith('js/site.js') ? filePath : null;
}

function main() {
  const target = resolveTargetFile(readHookPayload(), process.cwd());
  if (target === null) return; // hook fired for an unrelated file — nothing to do
  if (!fs.existsSync(target)) {
    console.error('check-i18n-parity: could not find ' + target);
    return;
  }
  let text;
  try {
    text = loadText(target);
  } catch (err) {
    console.error('check-i18n-parity: failed to parse TEXT object — ' + err.message);
    return;
  }
  if (!text.en || !text.ar) {
    console.error('check-i18n-parity: TEXT is missing an `en` or `ar` block.');
    return;
  }
  const { onlyA, onlyB } = diffKeys(text.en, text.ar);
  if (!onlyA.length && !onlyB.length) {
    console.log('check-i18n-parity: TEXT.en/TEXT.ar keys are in sync (' + Object.keys(text.en).length + ' keys).');
    return;
  }
  console.warn('check-i18n-parity: TEXT.en/TEXT.ar key mismatch found.');
  if (onlyA.length) console.warn('  Missing from ar: ' + onlyA.join(', '));
  if (onlyB.length) console.warn('  Missing from en: ' + onlyB.join(', '));
}

main();
