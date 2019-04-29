export default function checkWebPSupport(): void {
  const elem = document.createElement('canvas');
  const g = globalThis as any;

  if (elem.getContext && elem.getContext('2d')) {
    // was able or not to get WebP representation
    g.webpSupport = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    if (g.webpSupport) {
      console.log('WebP is supported');
    } else {
      console.log('WebP is not supported');
    }
  }
}
