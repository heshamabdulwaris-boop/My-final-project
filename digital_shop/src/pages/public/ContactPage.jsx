import { useState } from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ChevronDown, 
  ChevronUp,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  User,
  FileText,
  MessageSquare
} from 'lucide-react'
import contactService from '@services/contact/contactService'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqs = [
    {
      id: 1,
      question: 'How do I become a seller?',
      answer: 'To become a seller, click on the "Become a Seller" button in the header, fill out the seller registration form with your details, and wait for approval. Once approved, you can start uploading your digital products.'
    },
    {
      id: 2,
      question: 'How do I download purchased files?',
      answer: 'After purchasing a product, you can download it from your "My Purchases" section. Simply click the download button next to the product you want to download. Files are available instantly after purchase.'
    },
    {
      id: 3,
      question: 'How can I request a refund?',
      answer: 'Refund requests can be made within 7 days of purchase. Contact our support team with your order details and reason for refund. We review each request on a case-by-case basis.'
    },
    {
      id: 4,
      question: 'How can I report an issue?',
      answer: 'If you encounter any issues with a product or the platform, please use the contact form below or email our support team. Include as much detail as possible to help us resolve the issue quickly.'
    }
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      value: 'digitalshopmarketplace.com',
      link: 'mailto:digitalshopmarketplace.com',
      description: 'For general inquiries and support'
    },
    {
      icon: Mail,
      title: 'Business Email',
      value: 'business@digitalmarket.com',
      link: 'mailto:business@digitalmarket.com',
      description: 'For partnerships and business opportunities'
    },
    {
      icon: Phone,
      title: 'Phone Number',
      value: '+93 73 000 033 3',
      link: 'tel:+93730000333',
      description: 'Mon-Fri, 9am-6pm Kabul time'
    },
    {
      icon: MapPin,
      title: 'Office Address',
      value: 'Kabul, Afghanistan',
      description: 'Visit our headquarters'
    }
  ]


  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Name is required'
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = 'Name must be at least 3 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // Validate on blur
    if (formData[name]) {
      validateForm()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      full_name: true,
      email: true,
      message: true
    })
    
    if (!validateForm()) {
      return
    }
    
    setSubmitting(true)
    setSubmitStatus(null)
    
    try {
      await contactService.sendMessage({
        full_name: formData.full_name,
        email: formData.email,
        message: formData.message
      })
      
      setSubmitting(false)
      setSubmitStatus('success')
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        message: ''
      })
      setTouched({})
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000)
    } catch (error) {
      setSubmitting(false)
      setSubmitStatus('error')
      
      // Handle validation errors from backend
      if (error.response?.data) {
        const backendErrors = error.response.data
        const newErrors = {}
        
        if (backendErrors.full_name) {
          newErrors.full_name = Array.isArray(backendErrors.full_name) 
            ? backendErrors.full_name[0] 
            : backendErrors.full_name
        }
        if (backendErrors.email) {
          newErrors.email = Array.isArray(backendErrors.email) 
            ? backendErrors.email[0] 
            : backendErrors.email
        }
        if (backendErrors.message) {
          newErrors.message = Array.isArray(backendErrors.message) 
            ? backendErrors.message[0] 
            : backendErrors.message
        }
        
        setErrors(newErrors)
      }
      
      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-900 py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're here to help creators and customers. Have a question, feedback, or partnership idea? We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <a
                  key={index}
                  href={info.link}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {info.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {info.description}
                  </p>
                  <p className="text-base font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                    {info.value}
                  </p>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Send us a Message
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-10 border border-gray-200 dark:border-gray-700 shadow-xl">
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  Failed to send message. Please try again later.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm ${
                        touched.full_name && errors.full_name ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {touched.full_name && errors.full_name && (
                    <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm ${
                        touched.email && errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={6}
                    className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm resize-none ${
                      touched.message && errors.message ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                {touched.message && errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 text-sm"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-5 pt-0">
                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {/* <div className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 lg:p-12 text-center border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Our support team is ready to help you with any questions or issues you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-lg">
                Contact Support
              </button>
              <button className="px-8 py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600">
                Browse Help Center
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}
