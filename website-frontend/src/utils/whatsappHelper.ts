export const getWhatsAppLink = (productName: string, weight: string = '') => {
  const phoneNumber = '916361087282'; // Business number
  const message = weight 
    ? `Hello! I am interested in a bulk order for ${productName} (${weight}). Please provide more details and pricing.`
    : `Hello! I am interested in a bulk order for ${productName}. Please provide more details and pricing.`;
  
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};
