import { motion } from 'framer-motion'
import { Eye, Sparkles, TrendingUp, Rocket } from 'lucide-react'

export function VisionSection() {
  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Vision
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Building the future of digital commerce
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }} />
            </div>

            <div className="flex items-start gap-6 mb-8 relative z-10">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.15 }}
                transition={{ duration: 0.6 }}
                className="w-24 h-24 bg-gradient-to-br from-pink-500 via-orange-500 to-yellow-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl ring-4 ring-white dark:ring-gray-800 relative"
              >
                <Eye className="h-12 w-12 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                </div>
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Building a Trusted Digital Economy</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  We envision a world where digital commerce is accessible, secure, and transparent for everyone. Our platform is designed to foster trust between creators and buyers, creating a sustainable ecosystem for digital products.
                </p>
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 ring-4 ring-white dark:ring-gray-800">
                  <TrendingUp className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">Supporting Startups and Creators</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Empowering entrepreneurs and content creators to monetize their work and build sustainable digital businesses.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 ring-4 ring-white dark:ring-gray-800">
                  <Rocket className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">Future-Ready Marketplace Ecosystem</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Building a scalable platform that adapts to emerging technologies and market trends, ensuring long-term success for all users.</p>
                </div>
              </div>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
