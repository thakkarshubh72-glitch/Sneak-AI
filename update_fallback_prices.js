const fs = require('fs');
const path = require('path');

const fallbackDataPath = path.join(__dirname, 'FRONTEND/data/sneakers.js');
let dataContent = fs.readFileSync(fallbackDataPath, 'utf8');

// The prices are hardcoded numbers in the JS file like `price: 180,` or `originalPrice: 200,`
function toINR(usd) {
  if (!usd) return null;
  const inr = usd * 83;
  return Math.round(inr / 100) * 100 - 1;
}

dataContent = dataContent.replace(/price:\s*([0-9.]+),/g, (match, price) => {
  return `price: ${toINR(parseFloat(price))},`;
});

dataContent = dataContent.replace(/originalPrice:\s*([0-9.]+),/g, (match, origPrice) => {
  return `originalPrice: ${toINR(parseFloat(origPrice))},`;
});

fs.writeFileSync(fallbackDataPath, dataContent);
console.log('Updated FRONTEND/data/sneakers.js');
