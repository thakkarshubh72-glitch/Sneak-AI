const fs = require('fs');
const path = require('path');

// Convert USD to a realistic INR price ending in 99
function toINR(usd) {
  if (!usd) return null;
  const inr = usd * 83;
  // Round to nearest 100, then subtract 1 to end in 99
  return Math.round(inr / 100) * 100 - 1;
}

// 1. Update ai-service/data/sneakers.json
const aiDataPath = path.join(__dirname, 'ai-service/data/sneakers.json');
let aiData = JSON.parse(fs.readFileSync(aiDataPath, 'utf8'));
aiData = aiData.map(s => {
  if (s.price) s.price = toINR(s.price);
  if (s.originalPrice) s.originalPrice = toINR(s.originalPrice);
  return s;
});
fs.writeFileSync(aiDataPath, JSON.stringify(aiData, null, 2));
console.log('Updated ai-service/data/sneakers.json');

// 2. Update BACKEND/seed.js
const seedPath = path.join(__dirname, 'BACKEND/seed.js');
let seedContent = fs.readFileSync(seedPath, 'utf8');

// The prices are the 4th and 5th arguments in makeSneaker(id, 'Name', 'Brand', price, origPrice, ...)
// We can use a regex replacement with a replacer function
seedContent = seedContent.replace(/(makeSneaker\([^,]+,\s*'[^']+',\s*'[^']+',\s*)([0-9.]+)(,\s*)([0-9.]+|null)(,)/g, (match, prefix, price, mid, origPrice, suffix) => {
  const newPrice = toINR(parseFloat(price));
  let newOrigPrice = origPrice;
  if (origPrice !== 'null') {
    newOrigPrice = toINR(parseFloat(origPrice));
  }
  return `${prefix}${newPrice}${mid}${newOrigPrice}${suffix}`;
});

fs.writeFileSync(seedPath, seedContent);
console.log('Updated BACKEND/seed.js');

// 3. Update BACKEND/models/Sneaker.js to add currency field (default 'INR')
const modelPath = path.join(__dirname, 'BACKEND/models/Sneaker.js');
let modelContent = fs.readFileSync(modelPath, 'utf8');
if (!modelContent.includes('currency:')) {
  modelContent = modelContent.replace(
    'price: { type: Number, required: true },',
    "price: { type: Number, required: true },\n  currency: { type: String, default: 'INR' },"
  );
  fs.writeFileSync(modelPath, modelContent);
  console.log('Updated BACKEND/models/Sneaker.js');
}
