import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, CheckCircle2, Zap, Globe } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'

export function CTASection() {
  const navigate = useNavigate()
  const { user } = useAuth()
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[#635BFF] mb-8 shadow-2xl ring-4 ring-white dark:ring-gray-800"
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-h2 font-semibold text-[#111827] mb-6 leading-tight">
            Start Selling Your Digital Products Today
          </h2>

          {/* Subheadline */}
          <p className="text-base text-[#6B7280] max-w-2xl mx-auto mb-12 leading-relaxed">
            Join thousands of creators who are already earning with Digital Shop
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => {
                if (user) {
                  navigate('/seller/dashboard')
                } else {
                  navigate('/auth/register')
                }
              }}
              className="w-full sm:w-auto px-10 py-4 bg-[#635BFF] text-white font-bold hover:bg-[#4F47E6] transition-all duration-250 ease flex items-center justify-center gap-3"
              style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Become a Seller
              <ArrowRight className="h-5 w-5" />
            </button>
            <Link to="/products" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-10 py-4 bg-[#FFFFFF] border-2 border-[#635BFF] text-[#635BFF] font-bold hover:bg-[#F8FAFC] transition-all duration-250 ease"
                style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Explore Marketplace
              </motion.button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8"
          >
            <div className="flex items-center gap-2 text-[#6B7280] bg-[#FFFFFF] px-4 py-2 border border-[#E5E7EB] transition-all duration-250 ease" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">No listing fees</span>
            </div>
            <div className="flex items-center gap-2 text-[#6B7280] bg-[#FFFFFF] px-4 py-2 border border-[#E5E7EB] transition-all duration-250 ease" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Instant payouts</span>
            </div>
            <div className="flex items-center gap-2 text-[#6B7280] bg-[#FFFFFF] px-4 py-2 border border-[#E5E7EB] transition-all duration-250 ease" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Global audience</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
