import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function FooterCTA() {
  return (
    <section className="py-16 bg-indigo-600 dark:bg-indigo-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mb-6"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-h2 font-semibold text-white mb-4">
            Start Selling Digital Products Today
          </h2>

          {/* Subheadline */}
          <p className="text-base text-white/90 max-w-2xl mx-auto mb-8">
            Join creators and startups building income through digital products
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Become a Seller
              <ArrowRight className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Explore Marketplace
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-8"
          >
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-sm">No listing fees</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-sm">Instant payouts</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-sm">Global audience</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
