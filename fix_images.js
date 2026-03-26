const fs = require('fs');

let content = fs.readFileSync('FRONTEND/data/sneakers.js', 'utf8');

const imageUrls = {
  1: 'https://images.unsplash.com/photo-1605340537586-643ed28f5979?auto=format&fit=crop&w=800&q=80', // Air Nova X
  2: 'https://images.unsplash.com/photo-1584735174965-48c48d7cdfde?auto=format&fit=crop&w=800&q=80', // Ultra Boost 24
  3: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&w=800&q=80', // Yeezy
  4: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // Jordan 1
  5: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80', // NB 990v6
  6: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80', // Asics
  7: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', // Dunk Panda
  8: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80', // Cloudmonster
  9: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80', // Forum Low
  10: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80', // Saucony
  11: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80', // AM97 Silver Bullet
  12: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80', // Puma
  13: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80', // Salomon
  14: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&w=800&q=80', // Reebok
  15: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80', // Air Force 1
};

const defaultImage = 'https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&w=800&q=80';

let updated = content.replace(/id:\s*'(\d+)',([\s\S]*?)images:\s*\[[^\]]+\]/g, (match, id, middle) => {
  const imageUrl = imageUrls[id] || defaultImage;
  return `id: '${id}',${middle}images: ['${imageUrl}']`;
});

fs.writeFileSync('FRONTEND/data/sneakers.js', updated);

// Also do the same for ai-service/data/sneakers.json
const aiPath = 'ai-service/data/sneakers.json';
if (fs.existsSync(aiPath)) {
  let aiData = JSON.parse(fs.readFileSync(aiPath, 'utf8'));
  aiData = aiData.map((s, index) => {
    const snId = s.id || (index+1).toString();
    s.images = [imageUrls[snId] || defaultImage];
    s.image_urls = s.images;
    return s;
  });
  fs.writeFileSync(aiPath, JSON.stringify(aiData, null, 2));
}

console.log("Images fixed!");
