// Quick fix script to reset gigs and hours to 0
// DELETE THIS FILE after running

// 1. Clear localStorage
localStorage.removeItem('availabilityListings');

// 2. Fetch current listings from database
fetch('/api/freelancer/listings')
    .then(r => r.json())
    .then(({ listings }) => {
        // Reset gigs and hours to 0
        const updated = listings.map(l => ({
            ...l,
            gigs: 0,
            hours: 0
        }));

        // Save back to database
        return fetch('/api/freelancer/listings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listings: updated })
        });
    })
    .then(() => {
        console.log('✅ Reset complete! Refresh the page.');
    })
    .catch(err => console.error('Error:', err));
