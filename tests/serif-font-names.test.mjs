// The serif is a trimmed copy of Google's Source Serif 4 subsets. Adobe's licence (SIL OFL
// 1.1) names 'Source' as a Reserved Font Name, and a modified copy may not carry it as its
// name, so the naming records inside each served file were renamed to Vlads Playbook Serif.
// The copyright and licence records (ids 0 and 7-14) must keep their text, 'Source' included.
// A WOFF2 file stores the name table untransformed inside one brotli stream, so Node alone
// can read it. Reads public/ only (CI runs these tests before the build).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';

const KNOWN_TAGS = ['cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill'];
const PROTECTED_IDS = new Set([0, 7, 8, 9, 10, 11, 12, 13, 14]);

export function readWoff2Names(buf) {
  assert.equal(buf.toString('latin1', 0, 4), 'wOF2', 'not a WOFF2 file');
  const numTables = buf.readUInt16BE(12);
  const compressedLength = buf.readUInt32BE(20);
  let p = 48;
  const base128 = () => {
    let v = 0;
    for (let i = 0; i < 5; i++) {
      const b = buf[p++];
      v = v * 128 + (b & 0x7f);
      if (!(b & 0x80)) return v;
    }
    throw new Error('bad UIntBase128');
  };
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const flags = buf[p++];
    let tag;
    if ((flags & 0x3f) === 0x3f) { tag = buf.toString('latin1', p, p + 4); p += 4; } else tag = KNOWN_TAGS[flags & 0x3f];
    const version = flags >> 6;
    const origLength = base128();
    const transformed = tag === 'glyf' || tag === 'loca' ? version !== 3 : version !== 0;
    const length = transformed ? base128() : origLength;
    tables.push({ tag, length, transformed });
  }
  const data = brotliDecompressSync(buf.subarray(p, p + compressedLength));
  let off = 0;
  for (const t of tables) {
    if (t.tag === 'name') {
      assert.equal(t.transformed, false, 'name table is transformed');
      return parseName(data.subarray(off, off + t.length));
    }
    off += t.length;
  }
  throw new Error('no name table');
}

function parseName(n) {
  const count = n.readUInt16BE(2);
  const strings = n.readUInt16BE(4);
  const out = [];
  for (let i = 0; i < count; i++) {
    const r = 6 + i * 12;
    const platformID = n.readUInt16BE(r);
    const nameID = n.readUInt16BE(r + 6);
    const len = n.readUInt16BE(r + 8);
    const start = strings + n.readUInt16BE(r + 10);
    const raw = n.subarray(start, start + len);
    // Windows (3) and Unicode (0) records are UTF-16BE; Macintosh (1) records are single-byte.
    const text = platformID === 1 ? raw.toString('latin1') : Buffer.from(raw).swap16().toString('utf16le');
    out.push({ platformID, nameID, text });
  }
  return out;
}

export function sourceNamedRecords(records) {
  return records.filter((r) => !PROTECTED_IDS.has(r.nameID) && /source/i.test(r.text));
}

const FILES = ['source-serif-4-latin.woff2', 'source-serif-4-latin-ext.woff2', 'source-serif-4-greek.woff2'];
const fontPath = (f) => process.env.SERIF_FONT_DIR ? `${process.env.SERIF_FONT_DIR}/${f}` : new URL(`../public/fonts/${f}`, import.meta.url);

for (const file of FILES) {
  test(`${file}: no naming record carries the reserved name 'Source'`, () => {
    const records = readWoff2Names(readFileSync(fontPath(file)));
    assert.deepEqual(sourceNamedRecords(records).map((r) => `${r.nameID}: ${r.text}`), []);
    const family = records.find((r) => r.nameID === 1);
    assert.equal(family?.text, 'Vlads Playbook Serif');
    const ps = records.find((r) => r.nameID === 6);
    assert.equal(ps?.text, 'VladsPlaybookSerifRoman-Regular');
  });

  test(`${file}: the copyright and licence records keep their text`, () => {
    const records = readWoff2Names(readFileSync(fontPath(file)));
    const copyright = records.find((r) => r.nameID === 0);
    assert.match(copyright?.text ?? '', /Adobe Systems Incorporated .*Reserved Font Name .Source.\./);
    assert.equal(records.find((r) => r.nameID === 14)?.text, 'http://scripts.sil.org/OFL');
  });
}
