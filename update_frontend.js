const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Ensure formatINR is imported
  if (content.includes('import ') && !content.includes('formatINR')) {
    content = content.replace(/(import .* from .*;\n)(?!=import )/, '$1import { formatINR } from "@/lib/currency";\n');
    changed = true;
  }
  
  for (const [search, replace] of replacements) {
    if (content.includes(search)) {
      content = content.split(search).join(replace);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${path.basename(filePath)}`);
  }
}

const frontendDir = path.join(__dirname, 'FRONTEND/app');

// 1. cart/page.js
replaceInFile(path.join(frontendDir, 'cart/page.js'), [
  ['const shipping = total > 150 ? 0 : 12.99;', 'const shipping = total > 15000 ? 0 : 499;'],
  ['${(item.price * item.quantity).toFixed(2)}', '{formatINR(item.price * item.quantity)}'],
  ['${total.toFixed(2)}', '{formatINR(total)}'],
  ['`$${shipping.toFixed(2)}`', 'formatINR(shipping)'],
  ['${tax.toFixed(2)}', '{formatINR(tax)}'],
  ['${(total + shipping + tax).toFixed(2)}', '{formatINR(total + shipping + tax)}'],
  ['over $150', 'over {formatINR(15000)}']
]);

// 2. checkout/page.js
replaceInFile(path.join(frontendDir, 'checkout/page.js'), [
  ['const shipping = total > 150 ? 0 : 12.99;', 'const shipping = total > 15000 ? 0 : 499;'],
  ['${(item.price * item.quantity).toFixed(2)}', '{formatINR(item.price * item.quantity)}'],
  ['${total.toFixed(2)}', '{formatINR(total)}'],
  ['`$${shipping.toFixed(2)}`', 'formatINR(shipping)'],
  ['${tax.toFixed(2)}', '{formatINR(tax)}'],
  ['${grandTotal.toFixed(2)}', '{formatINR(grandTotal)}'],
  ['— ${grandTotal.toFixed(2)}', '— {formatINR(grandTotal)}']
]);

// 3. sneakers/[id]/page.js
replaceInFile(path.join(frontendDir, 'sneakers/[id]/page.js'), [
  ['${sneaker.price}', '{formatINR(sneaker.price)}'],
  ['${sneaker.originalPrice}', '{formatINR(sneaker.originalPrice)}'],
  ['${(sneaker.originalPrice - sneaker.price).toFixed(2)}', '{formatINR(sneaker.originalPrice - sneaker.price)}']
]);

// 4. recommend/page.js
replaceInFile(path.join(frontendDir, 'recommend/page.js'), [
  ['budget: 300,', 'budget: 25000,'],
  ['${prefs.budget}', '{formatINR(prefs.budget)}'],
  ['min="50" max="1200" step="10"', 'min="4000" max="100000" step="1000"'],
  ['<span>$50</span><span>$600</span><span>$1200+</span>', '<span>{formatINR(4000)}</span><span>{formatINR(50000)}</span><span>{formatINR(100000)}+</span>'],
  ['[100, 200, 300, 500].map((v)', '[10000, 15000, 25000, 50000].map((v)'],
  ['${v}</button>', '{formatINR(v)}</button>']
]);

console.log('Frontend updates complete.');
