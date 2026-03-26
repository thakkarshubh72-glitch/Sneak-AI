export function formatINR(amount) {
  if (amount === undefined || amount === null) return '₹0';
  
  // Format with commas for Indian num system and add Rupee symbol
  // e.g. 15000 -> ₹15,000
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
