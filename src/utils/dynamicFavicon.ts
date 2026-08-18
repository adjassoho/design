/**
 * Utility to dynamically update the browser favicon, touch icon, OpenGraph,
 * and Twitter preview meta tags based on the uploaded deceased portrait photo and profile details.
 */

export function updateDynamicFaviconAndMeta(
  imageUrl: string | undefined,
  fullName?: string,
  lifeYears?: string
) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Update Document Title & OpenGraph Title
  const titleText = fullName ? `Faire-part • ${fullName}` : 'Faire-part d’Obsèques';
  document.title = titleText;

  const descText = fullName
    ? `À la mémoire de ${fullName}${lifeYears ? ` (${lifeYears})` : ''} — Faire-part d'obsèques officiel et programme de célébration.`
    : `Faire-part officiel d'obsèques, programme du culte, hommages et recueillement.`;

  const setMeta = (attr: 'property' | 'name', key: string, value: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.content = value;
  };

  // Open Graph metadata for WhatsApp, Facebook, LinkedIn
  setMeta('property', 'og:title', titleText);
  setMeta('property', 'og:description', descText);
  setMeta('property', 'og:type', 'website');

  // Twitter Cards
  setMeta('name', 'twitter:title', titleText);
  setMeta('name', 'twitter:description', descText);
  setMeta('name', 'twitter:card', 'summary_large_image');

  if (!imageUrl) return;

  // Update raw image URL for Open Graph crawlers (WhatsApp needs standard HTTP/HTTPS or data URL)
  setMeta('property', 'og:image', imageUrl);
  setMeta('property', 'og:image:secure_url', imageUrl);
  setMeta('name', 'twitter:image', imageUrl);

  const updateFaviconLinks = (faviconHref: string) => {
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
  };

  // Create a circular gold-bordered favicon badge
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
          updateFaviconLinks(imageUrl);
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
        updateFaviconLinks(badgeDataUrl);
      } catch (canvasErr) {
        updateFaviconLinks(imageUrl);
      }
    };

    img.onerror = () => {
      updateFaviconLinks(imageUrl);
    };

    img.src = imageUrl;
  } catch (err) {
    updateFaviconLinks(imageUrl);
  }
}
