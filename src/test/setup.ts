import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * vitest runs without `globals: true`, so Testing Library cannot self-register
 * its auto-cleanup hook — rendered trees would otherwise pile up in the same
 * document and turn getBy* queries into "multiple elements found" failures.
 */
afterEach(cleanup);

/**
 * lottie-web (via lottie-react, pulled in by hs-stampy-promotions) probes a 2D
 * canvas context at import time and writes to it. jsdom ships no canvas backend,
 * so getContext() returns null and the import throws — which takes down every
 * suite that imports the package barrel.
 *
 * A permissive stub keeps the barrel importable without adding the heavyweight
 * `canvas` package as a dev dependency. Anything that genuinely needs to assert
 * on canvas output should install `canvas` and drop this shim.
 */
if (typeof HTMLCanvasElement !== 'undefined') {
  const stub2dContext = () => ({
    canvas: null,
    fillStyle: '',
    strokeStyle: '',
    beginPath: () => {},
    clearRect: () => {},
    closePath: () => {},
    createImageData: () => ({ data: new Uint8ClampedArray() }),
    drawImage: () => {},
    fill: () => {},
    fillRect: () => {},
    fillText: () => {},
    getImageData: () => ({ data: new Uint8ClampedArray() }),
    lineTo: () => {},
    measureText: () => ({ width: 0 }),
    moveTo: () => {},
    putImageData: () => {},
    restore: () => {},
    save: () => {},
    scale: () => {},
    setTransform: () => {},
    stroke: () => {},
    transform: () => {},
    translate: () => {},
  });

  HTMLCanvasElement.prototype.getContext = ((type: string) =>
    type === '2d' ? stub2dContext() : null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
