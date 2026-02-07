const GENERIC_ICON = 'https://cdn-icons-png.flaticon.com/512/633/633600.png';

const KEYWORD_MAP = {
  'phone': 'apple', 
  'workemail': 'gmail',
  'personalemail': 'icloud',
  'authapp': 'googleauthenticator',
  'authenticator': 'authy',
  'sms': 'twilio',
};

const getSlug = (name) => {
  const clean = name.toLowerCase().replace(/\s+/g, '');
  return KEYWORD_MAP[clean] || clean;
};

export const getIconUrl = (name) => {
  if (!name || name === "Select an Account") return GENERIC_ICON;
  const slug = getSlug(name);
  return `https://cdn.simpleicons.org/${slug}`;
};

export const getIconUrls = (name) => {
  if (!name || name === "Select an Account") return [GENERIC_ICON];
  
  const slug = getSlug(name);
  const domain = `${slug}.com`;

  return [
    `https://cdn.simpleicons.org/${slug}`,
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
  ];
};

export const loadImage = (name) => {
  const urls = getIconUrls(name);
  return new Promise((resolve) => {
    const tryLoad = (index) => {
      if (index >= urls.length) {
        const finalImg = new Image();
        finalImg.src = GENERIC_ICON;
        finalImg.onload = () => resolve(finalImg);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = urls[index];
      img.onload = () => {
        if (img.width <= 1) tryLoad(index + 1);
        else resolve(img);
      };
      img.onerror = () => tryLoad(index + 1);
    };
    tryLoad(0);
  });
};