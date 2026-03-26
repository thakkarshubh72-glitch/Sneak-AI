const fs = require('fs');
const path = require('path');

// 1. Update BACKEND/seed.js
const seedPath = path.join(__dirname, 'BACKEND/seed.js');
let seedContent = fs.readFileSync(seedPath, 'utf8');
seedContent = seedContent.replace(/image_urls:\s*\[([^\]]+)\]/g, "image_urls: ['/images/sneakers/placeholder.png']");
fs.writeFileSync(seedPath, seedContent);

// 2. Update FRONTEND/data/sneakers.js
const frontendDataPath = path.join(__dirname, 'FRONTEND/data/sneakers.js');
let frontendDataContent = fs.readFileSync(frontendDataPath, 'utf8');
frontendDataContent = frontendDataContent.replace(/image_urls:\s*\[([^\]]+)\]/g, "image_urls: ['/images/sneakers/placeholder.png']");
fs.writeFileSync(frontendDataPath, frontendDataContent);

// 3. Update ai-service/data/sneakers.json
const aiDataPath = path.join(__dirname, 'ai-service/data/sneakers.json');
try {
  let aiData = JSON.parse(fs.readFileSync(aiDataPath, 'utf8'));
  aiData = aiData.map(s => {
    s.images = ['/images/sneakers/placeholder.png'];
    s.image_urls = ['/images/sneakers/placeholder.png'];
    return s;
  });
  fs.writeFileSync(aiDataPath, JSON.stringify(aiData, null, 2));
} catch (e) {
  console.log("Error updating AI service data:", e);
}

console.log("Images updated successfully!");
