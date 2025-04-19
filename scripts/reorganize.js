const fs = require('fs');
const path = require('path');

const moves = [
  // Move API routes
  { from: 'src/app/api', to: 'src/lib/api/routes' },
  
  // Move client-related pages
  { from: 'src/app/hire', to: 'src/app/client/hire' },
  { from: 'src/app/bookings', to: 'src/app/client/bookings' },
  { from: 'src/app/discover', to: 'src/app/freelancer/discover' },
  
  // Move components
  { from: 'src/components/layout', to: 'src/components/layouts' },
  { from: 'src/components/splash-screen.tsx', to: 'src/components/ui/splash-screen.tsx' },
  { from: 'src/components/map', to: 'src/components/client/map' },
  { from: 'src/components/services', to: 'src/components/client/services' },
  { from: 'src/components/feed', to: 'src/components/freelancer/feed' },
  { from: 'src/components/job', to: 'src/components/client/job' },
  
  // Move lib services
  { from: 'src/lib/services', to: 'src/lib/api/services' }
];

function moveDirectory(from, to) {
  if (!fs.existsSync(from)) return;
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(path.dirname(to))) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
  }
  
  // Move the directory
  fs.renameSync(from, to);
  console.log(`Moved ${from} to ${to}`);
}

// Execute moves
moves.forEach(({ from, to }) => {
  try {
    moveDirectory(from, to);
  } catch (error) {
    console.error(`Error moving ${from} to ${to}:`, error.message);
  }
}); 