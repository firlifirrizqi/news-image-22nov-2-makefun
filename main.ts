// News-image entry for make.fun bounty news-image-20261122 (Node 22,
// standard library only). This is the SECOND entry for the same day:
// the image sums up Sunday 22 November 2026 in six stories that entry
// 1 did not cover — the blast on a Russian warship at Benghazi port,
// the candy factory fire in Banten, the settler attacks in the West
// Bank, the Manchester arena evacuation, the boat capsizing in
// Nigeria, and Nepal's prime minister starting his India visit —
// each checked against news first reported on 22 November 2026.
// The program only hands the image to the grader: it reads entry.png
// beside it, checks that it really is a PNG within the gate's limits
// (at most 1 MiB, at most 1024 by 1024 pixels), and copies it to the
// output directory, where the gate reads it.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = new URL('./entry.png', import.meta.url);

const bytes = readFileSync(source);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(pngMagic)) {
  console.error('entry.png is not a PNG file');
  process.exit(1);
}
if (bytes.length > 1048576) {
  console.error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
  process.exit(1);
}
// PNG IHDR: width at bytes 16-19, height at 20-23, big-endian.
// A short PNG (under 24 bytes) has no IHDR to read, so guard first.
if (bytes.length < 24) {
  console.error('entry.png is too short to hold a PNG header');
  process.exit(1);
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  console.error(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
  process.exit(1);
}
console.log(`entry.png: ${width}x${height}, ${bytes.length} bytes`);
copyFileSync(source, join(OUTPUT_DIR, 'entry.png'));
