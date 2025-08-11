export class SmartValidator {
  // Palabras comunes en español para validación básica
  private static commonSpanishWords = [
    'calle', 'avenida', 'colonia', 'fraccionamiento', 'residencial', 'municipio',
    'ciudad', 'estado', 'casa', 'departamento', 'piso', 'numero', 'interior',
    'exterior', 'principal', 'secundaria', 'andador', 'circuito', 'privada',
    'pasaje', 'camino', 'carretera', 'periferico', 'via', 'vialidad'
  ];

  // Detecta si una cadena tiene patrones repetitivos sin sentido
  static isMeaninglessPattern(text: string): boolean {
    if (!text || text.length < 3) return true;

    const normalized = text.toLowerCase().trim();
    
    // Detectar repeticiones excesivas del mismo carácter
    if (this.hasExcessiveRepetition(normalized)) {
      return true;
    }

    // Detectar secuencias sin sentido
    if (this.hasNonsenseSequence(normalized)) {
      return true;
    }

    // Detectar si parece una dirección real
    if (!this.isLikelyAddress(normalized) && !this.isLikelyName(normalized)) {
      return true;
    }

    return false;
  }

  private static hasExcessiveRepetition(text: string): boolean {
    const repetitionRegex = /(.)\1{3,}/;
    return repetitionRegex.test(text);
  }

  private static hasNonsenseSequence(text: string): boolean {
    const consonantClusters = /[bcdfghjklmnpqrstvwxyz]{4,}/i;
    
    const nonsensePattern = /([a-z])\1{2,}([a-z])\2{2,}/i;
    
    const uniqueChars = new Set(text.replace(/[^a-z]/gi, ''));
    const charArray = text.replace(/[^a-z]/gi, '').split('');
    const charCounts: { [key: string]: number } = {};
    
    charArray.forEach(char => {
      charCounts[char] = (charCounts[char] || 0) + 1;
    });
    
    const totalChars = charArray.length;
    const top3Chars = Object.values(charCounts)
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((sum, count) => sum + count, 0);
    
    const excessiveConcentration = (top3Chars / totalChars) > 0.8;
    
    return consonantClusters.test(text) || nonsensePattern.test(text) || excessiveConcentration;
  }

  private static isLikelyAddress(text: string): boolean {
    const hasCommonWord = this.commonSpanishWords.some(word => 
      text.includes(word)
    );
    
    const hasNumbers = /\d/.test(text);
    
    const hasReasonableLength = text.length >= 5;
    
    return hasCommonWord || (hasNumbers && hasReasonableLength);
  }

  private static isLikelyName(text: string): boolean {
    const words = text.split(/\s+/).filter(word => word.length >= 2);
    
    const hasValidWords = words.length >= 1 && words.every(word => 
      word.length >= 2 && this.hasReasonableVowelConsonantRatio(word)
    );
    
    const hasNoNumbers = !/\d/.test(text);
    
    return hasValidWords && hasNoNumbers && text.length >= 3;
  }

  private static hasReasonableVowelConsonantRatio(word: string): boolean {
    const vowels = word.match(/[aeiouáéíóú]/gi) || [];
    const consonants = word.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [];
    
    if (vowels.length === 0) return false;
    
    const totalLetters = vowels.length + consonants.length;
    const vowelRatio = vowels.length / totalLetters;
    
    return vowelRatio >= 0.2 && vowelRatio <= 0.6;
  }

  static isValidName(name: string): boolean {
    if (!name || name.length < 2) return false;
    
    if (this.isMeaninglessPattern(name)) {
      return false;
    }
    
    const validChars = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!validChars.test(name)) {
      return false;
    }
    
    return true;
  }

  static isValidAddress(address: string): boolean {
    if (!address || address.length < 5) return false;
    
    if (this.isMeaninglessPattern(address)) {
      return false;
    }
    
    const validChars = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-.,#]+$/;
    if (!validChars.test(address)) {
      return false;
    }
    
    return true;
  }
}
