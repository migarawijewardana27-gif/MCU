// Extract dominant color from an image URL using Canvas
export async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const defaultColor = '220, 20, 36'; // Marvel red fallback

    if (typeof window === 'undefined') {
      resolve(defaultColor);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(defaultColor);
          return;
        }

        // Sample at small size for performance
        const sampleSize = 50;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imageData.data;

        // Color frequency map (quantize to reduce colors)
        const colorMap: Record<string, { r: number; g: number; b: number; count: number }> = {};

        for (let i = 0; i < data.length; i += 4) {
          const r = Math.round(data[i] / 16) * 16;
          const g = Math.round(data[i + 1] / 16) * 16;
          const b = Math.round(data[i + 2] / 16) * 16;
          const a = data[i + 3];

          // Skip transparent and very dark/very light pixels
          if (a < 128) continue;
          const brightness = (r + g + b) / 3;
          if (brightness < 30 || brightness > 240) continue;

          const key = `${r},${g},${b}`;
          if (!colorMap[key]) {
            colorMap[key] = { r, g, b, count: 0 };
          }
          colorMap[key].count++;
        }

        // Find most frequent color
        let maxCount = 0;
        let dominantColor = defaultColor;

        Object.values(colorMap).forEach((color) => {
          // Weight towards more saturated colors
          const max = Math.max(color.r, color.g, color.b);
          const min = Math.min(color.r, color.g, color.b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          const weightedCount = color.count * (1 + saturation * 2);

          if (weightedCount > maxCount) {
            maxCount = weightedCount;
            dominantColor = `${color.r}, ${color.g}, ${color.b}`;
          }
        });

        resolve(dominantColor);
      } catch {
        resolve(defaultColor);
      }
    };

    img.onerror = () => resolve(defaultColor);

    // Use a small poster for color extraction
    img.src = imageUrl;
  });
}

// Generate CSS-compatible color variations from RGB string
export function getColorVariations(rgb: string) {
  const [r, g, b] = rgb.split(',').map(s => parseInt(s.trim()));
  return {
    full: `rgb(${r}, ${g}, ${b})`,
    glow: `rgba(${r}, ${g}, ${b}, 0.6)`,
    subtle: `rgba(${r}, ${g}, ${b}, 0.15)`,
    border: `rgba(${r}, ${g}, ${b}, 0.3)`,
    shadow: `0 0 40px rgba(${r}, ${g}, ${b}, 0.4), 0 0 80px rgba(${r}, ${g}, ${b}, 0.2)`,
  };
}
