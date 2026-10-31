export const PRODUCT_TYPES = {
  EBOOK: 'ebook',
  TEMPLATE: 'template',
  AUDIO: 'audio',
  MINI_COURSE: 'mini_course',
  GRAPHICS: 'graphics',
  DIGITAL_ASSET: 'digital_asset',
}

export const PRODUCT_CATEGORIES = {
  [PRODUCT_TYPES.EBOOK]: ['fiction', 'non-fiction', 'educational', 'business'],
  [PRODUCT_TYPES.TEMPLATE]: ['website', 'presentation', 'document', 'design'],
  [PRODUCT_TYPES.AUDIO]: ['music', 'sound_effects', 'audiobook', 'podcast'],
  [PRODUCT_TYPES.MINI_COURSE]: ['programming', 'design', 'business', 'marketing'],
  [PRODUCT_TYPES.GRAPHICS]: ['icons', 'illustrations', 'photos', 'vectors'],
  [PRODUCT_TYPES.DIGITAL_ASSET]: ['fonts', '3d_models', 'textures', 'presets'],
}
