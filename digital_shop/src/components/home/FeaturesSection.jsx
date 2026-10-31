import { motion } from 'framer-motion'
import { Shield, Zap, LayoutDashboard, Download, Wallet, BarChart, Sparkles, CheckCircle2 } from 'lucide-react'
import { features } from '@data/homeData'

const iconMap = {
  Shield,
  Zap,
  LayoutDashboard,
  Download,
  Wallet,
  BarChart
}

export function FeaturesSection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#635BFF] text-white text-sm font-medium mb-6 transition-all duration-250 ease"
            style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Platform Benefits</span>
          </motion.div>
          <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-4">
            Why Choose Digital Shop?
          </h2>
          <p className="text-base text-[#6B7280] max-w-2xl mx-auto">
            Everything you need to sell and discover premium digital products with confidence
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-4">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon]
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-250 ease h-full relative" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5 dark:opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                      backgroundSize: '32px 32px'
                    }} />
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`relative w-20 h-20 bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-xl ring-4 ring-white dark:ring-gray-800`}
                  >
                    <Icon className="h-10 w-10 text-white" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg" style={{ borderRadius: '8px' }}>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-h3 font-medium text-gray-900 dark:text-white mb-3 group-hover:text-[#635BFF] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-base text-[#6B7280] leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
