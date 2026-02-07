const GENERIC_ICON = 'https://cdn-icons-png.flaticon.com/512/633/633600.png';

export const getIconUrl = (name) => {
  if (!name) return GENERIC_ICON;
  
  const slug = name.toLowerCase().replace(/\s+/g, '');
  return `https://cdn.simpleicons.org/${slug}`;
};

export const loadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Important for Canvas drawing
    img.src = url;
    
    img.onload = () => resolve(img);
    
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.src = GENERIC_ICON;
      fallbackImg.onload = () => resolve(fallbackImg);
    };
  });
};