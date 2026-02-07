const GENERIC_ICON = 'https://cdn-icons-png.flaticon.com/512/633/633600.png';

const KEYWORD_MAP = {
  'phone': 'phone',
  'mail': 'gmail',
  'aws': 'amazonwebservices',
  'amazon': 'amazonwebservices',
  'auth': 'googleauthenticator',
  'workemail': 'gmail',
  'personalemail': 'icloud',
  'authenticator': 'authy',
  'sms': 'twilio'
};

const getSlug = (name) => {
  if (!name || typeof name !== 'string') return '';
  const clean = name.toLowerCase().replace(/\s+/g, '');
  return KEYWORD_MAP[clean] || clean;
};

export const getIconUrl = (name) => {
  if (!name || typeof name !== 'string' || name === "Select an Account") return GENERIC_ICON;
  const clean = name.toLowerCase().trim();
  
  if (clean === 'phone') return 'https://cdn-icons-png.flaticon.com/512/455/455705.png';
  
  const slug = getSlug(name);
  return `https://cdn.simpleicons.org/${slug}`;
};

export const loadImage = (name) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = getIconUrl(name);
    img.onload = () => resolve(img);
    img.onerror = () => {
      const fallback = new Image();
      fallback.src = GENERIC_ICON;
      fallback.onload = () => resolve(fallback);
    };
  });
};