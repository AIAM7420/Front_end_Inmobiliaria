export const mapStyles = {
  light: [
    // We removed { featureType: "poi", stylers: [{ visibility: "off" }] } and labels.icon
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] }
  ],
  dark: [
    // We removed { featureType: "poi", stylers: [{ visibility: "off" }] } and labels.icon
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
  ]
};

export const createSvgIcon = (propertyType: string, zoom: number = 13) => {
  const bgColor = '%23FA003F';
  const textColor = '%23FFFFFF';
  const borderColor = '%23FA003F';
  
  let iconPaths = '';
  if (propertyType === 'inmo') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="30" viewBox="0 0 60 30"> <rect x="2" y="2" width="56" height="20" rx="10" fill="${bgColor}" stroke="${borderColor}" stroke-width="2"/> <polygon points="30,28 25,22 35,22" fill="${bgColor}" /> <text x="30" y="16" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="${textColor}" text-anchor="middle">INMO</text> </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  } else if (propertyType === 'casa') {
    iconPaths = '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>';
  } else if (propertyType === 'departamento') {
    iconPaths = '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>';
  } else if (propertyType === 'terreno') {
    iconPaths = '<path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L14 3l-1.4 2.5"/>';
  } else {
    iconPaths = '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>';
  }

  if (zoom < 12) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="6" fill="${bgColor}" stroke="${textColor}" stroke-width="2"/></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${svg}`;
  }
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <path d="M24 44s14-14 14-24a14 14 0 0 0-28 0c0 10 14 24 14 24z" fill="${bgColor}" stroke="${borderColor}" stroke-width="2"/>
    <g transform="translate(12, 8)" fill="none" stroke="${textColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${iconPaths}
    </g>
  </svg>`;
  
  return `data:image/svg+xml;charset=UTF-8,${svg}`;
};

export const getInmoLogoIcon = (isDarkMode: boolean) => {
  if (typeof window === 'undefined' || !window.google) return null;
  return {
    url: isDarkMode ? '/inmo white.png' : '/inmo.png',
    scaledSize: new window.google.maps.Size(64, 20),
    anchor: new window.google.maps.Point(32, 10),
  };
};




export const generateCustomPinWithImage = async (imageUrl: string, isDarkMode: boolean): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 80;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      // Draw pin bubble
      ctx.fillStyle = isDarkMode ? '#333333' : '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(5, 5, 70, 30, 15);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FA003F';
      ctx.stroke();

      // Draw pin triangle
      ctx.beginPath();
      ctx.moveTo(35, 35);
      ctx.lineTo(40, 45);
      ctx.lineTo(45, 35);
      ctx.fillStyle = isDarkMode ? '#333333' : '#FFFFFF';
      ctx.fill();
      ctx.stroke();
      // Remove top line of triangle
      ctx.beginPath();
      ctx.moveTo(36, 35);
      ctx.lineTo(44, 35);
      ctx.strokeStyle = isDarkMode ? '#333333' : '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw image
      // Aspect ratio of inmo.png is wide, so we draw it scaled down
      ctx.drawImage(img, 15, 12, 50, 16);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve('');
  });
};

