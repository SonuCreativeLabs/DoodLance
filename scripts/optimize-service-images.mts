import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public/images/Service Catagories');

async function optimizeImages() {
  try {
    const files = await fs.readdir(imagesDir);
    
    // Filter for common image extensions
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg'].includes(ext);
    });
    
    console.log(`Found ${imageFiles.length} images to optimize.`);
    
    let compressedCount = 0;
    
    for (const file of imageFiles) {
      const filePath = path.join(imagesDir, file);
      const parsedPath = path.parse(filePath);
      const outputFilename = `${parsedPath.name}.webp`;
      const outputPath = path.join(imagesDir, outputFilename);
      
      try {
        // Optimize and compress logic:
        // Convert to WebP, resize (downscale) if width exceeds 800px, compression quality 80
        await sharp(filePath)
          .resize({ width: 800, withoutEnlargement: true }) // Downscale large images (e.g. Cricket 1024x1024 -> 800x800)
          .webp({ quality: 80 })
          .toFile(outputPath);
          
        compressedCount++;
        const originalStats = await fs.stat(filePath);
        const newStats = await fs.stat(outputPath);
        
        console.log(`✅ Optimized: ${file}`);
        console.log(`   Size reduction: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB -> ${(newStats.size / 1024).toFixed(2)} KB`);
        
      } catch (err) {
        console.error(`❌ Error optimizing ${file}:`, err);
      }
    }
    
    console.log(`\n🎉 Success! Optimized ${compressedCount} out of ${imageFiles.length} images to WebP format.`);
    
  } catch (error) {
    console.error('Failed to read image directory:', error);
  }
}

optimizeImages();
