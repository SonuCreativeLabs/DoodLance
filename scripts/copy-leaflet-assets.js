const fs = require('fs');
const path = require('path');

const leafletDir = path.join(process.cwd(), 'node_modules', 'leaflet', 'dist', 'images');
const publicDir = path.join(process.cwd(), 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy marker icons
const files = [
  'marker-icon.png',
  'marker-icon-2x.png',
  'marker-shadow.png'
];

files.forEach(file => {
  const source = path.join(leafletDir, file);
  const dest = path.join(publicDir, file);
  
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    console.log(`Copied ${file} to public directory`);
  } else {
    console.error(`File not found: ${source}`);
  }
}); 