import { MAX_COVER_SIZE, ALLOWED_COVER_TYPES, FILE_RULES, COVER_ERROR_MESSAGE } from '@constants/fileValidation';

/**
 * Validate cover image file
 * @param {File} file - The file to validate
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export function validateCoverImage(file) {
  if (!file) {
    return { isValid: true, error: null };
  }

  // Check file type
  const isAllowedType = ALLOWED_COVER_TYPES.includes(file.type);
  if (!isAllowedType) {
    return { isValid: false, error: COVER_ERROR_MESSAGE };
  }

  // Check file size
  if (file.size > MAX_COVER_SIZE) {
    return { isValid: false, error: COVER_ERROR_MESSAGE };
  }

  return { isValid: true, error: null };
}

/**
 * Validate product file based on category
 * @param {File} file - The file to validate
 * @param {string} category - The product category
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export function validateProductFile(file, category) {
  if (!file) {
    return { isValid: true, error: null };
  }

  const rules = FILE_RULES[category];
  
  if (!rules) {
    return { isValid: false, error: 'Invalid category selected' };
  }

  // For 'other' category, accept any file type
  if (rules.allowedTypes.includes('*')) {
    if (file.size > rules.maxSize) {
      return { 
        isValid: false, 
        error: `File cannot exceed ${rules.maxSizeLabel}` 
      };
    }
    return { isValid: true, error: null };
  }

  // Check file type
  const isAllowedType = rules.allowedTypes.includes(file.type);
  if (!isAllowedType) {
    return { 
      isValid: false, 
      error: `File must be ${rules.label} and cannot exceed ${rules.maxSizeLabel}` 
    };
  }

  // Check file size
  if (file.size > rules.maxSize) {
    return { 
      isValid: false, 
      error: `File cannot exceed ${rules.maxSizeLabel}` 
    };
  }

  return { isValid: true, error: null };
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 bytes';
  
  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get file validation rules for a category
 * @param {string} category - The product category
 * @returns {Object} - The validation rules for the category
 */
export function getFileRules(category) {
  return FILE_RULES[category] || FILE_RULES.other;
}
