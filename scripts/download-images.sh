#!/bin/bash

# Create the directory if it doesn't exist
mkdir -p public/images/services

# Download images from Unsplash
curl "https://source.unsplash.com/1200x800/?home,repair" -o public/images/services/home-repair.jpg
curl "https://source.unsplash.com/1200x800/?spa,wellness" -o public/images/services/beauty-wellness.jpg
curl "https://source.unsplash.com/1200x800/?education,study" -o public/images/services/education.jpg
curl "https://source.unsplash.com/1200x800/?creative,digital" -o public/images/services/creative-digital.jpg
curl "https://source.unsplash.com/1200x800/?event,party" -o public/images/services/events.jpg
curl "https://source.unsplash.com/1200x800/?pet,dog" -o public/images/services/pets.jpg
curl "https://source.unsplash.com/1200x800/?business,technology" -o public/images/services/business-tech.jpg
curl "https://source.unsplash.com/1200x800/?fitness,gym" -o public/images/services/fitness.jpg 