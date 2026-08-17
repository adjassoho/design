/**
 * Utility to dynamically update the browser favicon, touch icon, and page title
 * based on the uploaded deceased portrait photo and profile details.
 */

export function updateDynamicFaviconAndMeta(
  imageUrl: string | undefined,
  fullName?: string
) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Update Document Title
  const titleText = fullName ? `Faire-part • ${fullName}` : 'Faire-part';
  document.title = titleText;

  // Update meta tags if present
  const metaTitle = document.querySelector('meta[property="og:title"]');
  if (metaTitle) metaTitle.setAttribute('content', titleText);

  if (!imageUrl) return;

  const updateLinks = (faviconHref: string) => {
    // 1. Standard icon
    let iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }
    iconLink.type = 'image/png';
    iconLink.href = faviconHref;

    // 2. Shortcut icon for legacy browsers
    let shortcutLink = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;
    if (!shortcutLink) {
      shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      document.head.appendChild(shortcutLink);
    }
    shortcutLink.href = faviconHref;

    // 3. Apple Touch Icon for iOS Safari & PWA home screens
    let appleTouchLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
    if (!appleTouchLink) {
      appleTouchLink = document.createElement('link');
      appleTouchLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleTouchLink);
    }
    appleTouchLink.href = faviconHref;

    // 4. Update og:image meta tag
    let ogImageMeta = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
    if (!ogImageMeta) {
      ogImageMeta = document.createElement('meta');
      ogImageMeta.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageMeta);
    }
    ogImageMeta.content = faviconHref;
  };

  // If already a direct data URL or image, create a circular badge with gold rim
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          updateLinks(imageUrl);
          return;
        }

        ctx.clearRect(0, 0, size, size);

        // Circular clipping
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // Draw image cover-fitted
        const aspect = img.width / img.height;
        let drawW = size;
        let drawH = size;
        let dx = 0;
        let dy = 0;
        if (aspect > 1) {
          drawW = size * aspect;
          dx = -(drawW - size) / 2;
        } else {
          drawH = size / aspect;
          dy = -(drawH - size) / 2;
        }
        ctx.drawImage(img, dx, dy, drawW, drawH);
        ctx.restore();

        // Draw Gold Border ring around the avatar
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2, true);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#D4AF37'; // Imperial Memorial Gold
        ctx.stroke();

        const badgeDataUrl = canvas.toDataURL('image/png');
        updateLinks(badgeDataUrl);
      } catch (canvasErr) {
        // Fallback to raw image URL if canvas security blocks cross-origin
        updateLinks(imageUrl);
      }
    };

    img.onerror = () => {
      updateLinks(imageUrl);
    };

    img.src = imageUrl;
  } catch (err) {
    updateLinks(imageUrl);
  }
}
