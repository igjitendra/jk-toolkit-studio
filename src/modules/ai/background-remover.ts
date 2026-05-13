// ============================================================
// JK Toolkit Studio — Background Removal Module
// Modes: solid-replace, threshold-based, body-segmentation
// ============================================================

export type BgRemoveMode = 'solid' | 'chroma' | 'segment' | 'manual';

export interface BgRemoveOptions {
  mode: BgRemoveMode;
  replaceColor: string;    // hex or 'transparent'
  tolerance?: number;      // 0-100 for chroma keying
}

/**
 * Replace a solid background color with another color or transparency.
 * Flood-fill from corners approach.
 */
export function replaceSolidBackground(
  imageDataUrl: string,
  options: BgRemoveOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const tolerance = (options.tolerance ?? 40) * 2.55;

      // Sample background color from corners
      const corners = [
        [0, 0], [canvas.width - 1, 0],
        [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1],
      ];
      let avgR = 0, avgG = 0, avgB = 0;
      for (const [cx, cy] of corners) {
        const idx = (cy * canvas.width + cx) * 4;
        avgR += data[idx]; avgG += data[idx + 1]; avgB += data[idx + 2];
      }
      avgR /= 4; avgG /= 4; avgB /= 4;

      // Parse replacement color
      let repR = 255, repG = 255, repB = 255, repA = 255;
      if (options.replaceColor === 'transparent') {
        repA = 0;
      } else {
        const hex = options.replaceColor.replace('#', '');
        repR = parseInt(hex.substring(0, 2), 16);
        repG = parseInt(hex.substring(2, 4), 16);
        repB = parseInt(hex.substring(4, 6), 16);
      }

      // BFS flood fill from corners
      const visited = new Uint8Array(canvas.width * canvas.height);
      const queue: number[] = [];
      for (const [cx, cy] of corners) {
        const idx = cy * canvas.width + cx;
        if (!visited[idx]) { queue.push(idx); visited[idx] = 1; }
      }

      while (queue.length > 0) {
        const cur = queue.pop()!;
        const x = cur % canvas.width;
        const y = Math.floor(cur / canvas.width);
        const pi = cur * 4;
        const dr = Math.abs(data[pi] - avgR);
        const dg = Math.abs(data[pi + 1] - avgG);
        const db = Math.abs(data[pi + 2] - avgB);
        if (dr + dg + db > tolerance * 3) continue;
        data[pi] = repR; data[pi + 1] = repG; data[pi + 2] = repB; data[pi + 3] = repA;
        const neighbors = [cur - 1, cur + 1, cur - canvas.width, cur + canvas.width];
        for (const n of neighbors) {
          if (n >= 0 && n < canvas.width * canvas.height && !visited[n]) {
            visited[n] = 1;
            queue.push(n);
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png', 0.95));
    };
    img.onerror = reject;
    img.src = imageDataUrl;
  });
}

/**
 * Apply solid color background to an image (add background, not remove).
 */
export function applyBackgroundColor(imageDataUrl: string, color: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = reject;
    img.src = imageDataUrl;
  });
}
