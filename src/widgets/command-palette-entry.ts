// Loaded by CommandPaletteMount.astro on intent only (open request, Cmd/Ctrl-K, or a pointer or
// focus on the search button), so React, Radix and the search catalog stay off every page load.
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import CommandPalette from './CommandPalette';

let root: Root | null = null;
let mountNode: HTMLElement | null = null;

export function unmountCommandPalette(): void {
  root?.unmount();
  root = null;
  mountNode = null;
}

export function mountCommandPalette(): void {
  const node = document.getElementById('cc-palette-root');
  if (!node || node === mountNode) return;
  unmountCommandPalette();
  // A child host keeps React from clearing the mount's own inline script.
  const host = document.createElement('div');
  node.appendChild(host);
  root = createRoot(host);
  mountNode = node;
  root.render(createElement(CommandPalette));
}

// The router swaps in a new body; the old palette's listeners go with the old page.
document.addEventListener('astro:after-swap', unmountCommandPalette);
