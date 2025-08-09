export const ValidationPatterns = {
  // Only letters, spaces, and accented characters
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  
  // Address: letters, numbers, spaces, hyphens, dots, commas, hash
  address: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-.,#]+$/,
  
  // Phone: numbers, spaces, plus, hyphens, parentheses
  phone: /^[0-9+\-\s()]+$/
};
