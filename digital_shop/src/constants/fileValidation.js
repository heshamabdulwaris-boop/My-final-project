// File validation constants for product upload

export const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

export const ALLOWED_COVER_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const FILE_RULES = {
  ebook: {
    allowedTypes: ['application/pdf', 'application/epub+zip'],
    maxSize: 500 * 1024 * 1024, // 500 MB in bytes
    label: 'PDF, EPUB',
    maxSizeLabel: '500 MB'
  },
  course: {
    allowedTypes: ['application/zip', 'application/x-zip-compressed', 'video/mp4'],
    maxSize: 40 * 1024 * 1024 * 1024, // 40 GB in bytes
    label: 'ZIP, MP4',
    maxSizeLabel: '40 GB'
  },
  template: {
    allowedTypes: ['application/zip', 'application/x-zip-compressed', 'application/octet-stream', 'image/vnd.adobe.photoshop', 'application/x-fig'],
    maxSize: 1 * 1024 * 1024 * 1024, // 1 GB in bytes
    label: 'ZIP, FIG, PSD',
    maxSizeLabel: '1 GB'
  },
  photograph: {
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/x-adobe-dng', 'application/zip', 'application/x-zip-compressed'],
    maxSize: 3 * 1024 * 1024 * 1024, // 3 GB in bytes
    label: 'JPG, PNG, RAW, ZIP',
    maxSizeLabel: '3 GB'
  },
  other: {
    allowedTypes: ['*'], // Any file type
    maxSize: 2 * 1024 * 1024 * 1024, // 2 GB in bytes
    label: 'Any supported file',
    maxSizeLabel: '2 GB'
  }
};

export const COVER_ERROR_MESSAGE = 'Cover image must be JPG, PNG, or WEBP and cannot exceed 5 MB.';
