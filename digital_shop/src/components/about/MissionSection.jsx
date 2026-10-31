import { motion } from 'framer-motion'
import { Target, Sparkles } from 'lucide-react'

export function MissionSection() {
  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              We empower creators and startups to monetize digital content through a secure, user-friendly marketplace.
            </p>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Easy tools to upload, sell, and deliver digital products with secure transactions.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 lg:p-12 border border-gray-200 dark:border-gray-700 shadow-2xl relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }} />
              </div>

              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl ring-4 ring-white dark:ring-gray-800"
              >
                <Target className="h-12 w-12 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                </div>
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Secure Digital Commerce</h3>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Built with security and simplicity in mind, our platform ensures that both creators and buyers can transact with confidence.
              </p>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
