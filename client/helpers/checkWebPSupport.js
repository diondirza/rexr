export default function checkWebPSupport() {
  const elem = document.createElement('canvas');

  if (elem.getContext && elem.getContext('2d')) {
    // was able or not to get WebP representation
    global.webpSupport = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    if (global.webpSupport) {
      console.log('WebP is supported');
    } else {
      console.log('WebP is not supported');
    }
  }
}
