import { useState } from 'react'
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@contexts/ToastContext'
import { validateCoverImage, validateProductFile, formatFileSize, getFileRules } from '@utils/fileValidation'
import { COVER_ERROR_MESSAGE } from '@constants/fileValidation'

const CATEGORY_CHOICES = [
  { value: 'ebook', label: 'Ebook' },
  { value: 'course', label: 'Course' },
  { value: 'template', label: 'Template' },
  { value: 'photograph', label: 'Photograph' },
  { value: 'other', label: 'Other' },
]

export function ProductForm({ initialData, onSubmit, loading }) {
  const { error: showError } = useToast()
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'other',
    price: initialData?.price || '',
    file: null,
    cover_image: null,
  })

  const [filePreview, setFilePreview] = useState(initialData?.file || null)
  const [coverImagePreview, setCoverImagePreview] = useState(initialData?.cover_image || null)
  const [coverError, setCoverError] = useState(null)
  const [fileError, setFileError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate cover image
    if (formData.cover_image) {
      const coverValidation = validateCoverImage(formData.cover_image)
      if (!coverValidation.isValid) {
        setCoverError(coverValidation.error)
        showError(coverValidation.error)
        return
      }
    }

    // Validate product file
    if (formData.file) {
      const fileValidation = validateProductFile(formData.file, formData.category)
      if (!fileValidation.isValid) {
        setFileError(fileValidation.error)
        showError(fileValidation.error)
        return
      }
    }

    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('category', formData.category)
    data.append('price', formData.price)
    
    if (formData.file) {
      data.append('file', formData.file)
    }

    if (formData.cover_image) {
      data.append('cover_image', formData.cover_image)
    }

    onSubmit(data)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file immediately
      const validation = validateProductFile(file, formData.category)
      if (!validation.isValid) {
        setFileError(validation.error)
        showError(validation.error)
        return
      }
      
      setFileError(null)
      setFormData({ ...formData, file })
      setFilePreview(file.name)
    }
  }

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate cover image immediately
      const validation = validateCoverImage(file)
      if (!validation.isValid) {
        setCoverError(validation.error)
        showError(validation.error)
        return
      }
      
      setCoverError(null)
      setFormData({ ...formData, cover_image: file })
      setCoverImagePreview(URL.createObjectURL(file))
    }
  }

  const removeFile = () => {
    setFormData({ ...formData, file: null })
    setFilePreview(null)
    setFileError(null)
  }

  const removeCoverImage = () => {
    setFormData({ ...formData, cover_image: null })
    setCoverImagePreview(null)
    setCoverError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            maxLength={200}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            placeholder="Enter a descriptive title for your product"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum 200 characters</p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none shadow-sm"
            placeholder="Provide a detailed description of your product, including features, benefits, and what customers will receive"
          />
        </div>
      </div>

      {/* Pricing & Category Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <span className="text-base">$</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Category</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => {
                const newCategory = e.target.value
                setFormData({ ...formData, category: newCategory })
                // Re-validate file if it exists when category changes
                if (formData.file) {
                  const validation = validateProductFile(formData.file, newCategory)
                  if (!validation.isValid) {
                    setFileError(validation.error)
                  } else {
                    setFileError(null)
                  }
                }
              }}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            >
              {CATEGORY_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                step="1"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Media Files</h2>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cover Image
          </label>
          {coverError && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-2">{coverError}</p>
          )}
          {!coverImagePreview ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer">
              <input
                type="file"
                id="cover_image"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleCoverImageChange}
                className="hidden"
              />
              <label
                htmlFor="cover_image"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <ImageIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Upload cover image
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    JPG, PNG, WEBP (Max 5 MB)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shadow-md">
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formData.cover_image?.name || 'Cover image'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.cover_image?.size ? formatFileSize(formData.cover_image.size) : 'Existing image'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeCoverImage}
                className="p-2 rounded-lg text-gray-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product File <span className="text-red-500">*</span>
          </label>
          {fileError && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-2">{fileError}</p>
          )}
          {!filePreview ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                required={!initialData?.file}
                accept={formData.category === 'other' ? '*/*' : getFileRules(formData.category).allowedTypes.join(',')}
                className="hidden"
              />
              <label
                htmlFor="file"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Upload product file
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getFileRules(formData.category).label} (Max {getFileRules(formData.category).maxSizeLabel})
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formData.file?.name || filePreview}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.file?.size ? formatFileSize(formData.file.size) : 'Existing file'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 rounded-lg text-gray-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-base text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-base text-white font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            initialData ? 'Update Product' : 'Create Product'
          )}
        </button>
      </div>
    </form>
  )
}
