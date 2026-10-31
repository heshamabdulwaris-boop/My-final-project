import { motion } from 'framer-motion'
import { Sparkles, Globe, Users, TrendingUp } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-16 lg:py-20 px-4 sm:px-6 lg:px-8">

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Icon badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">About Us</span>
            </motion.div>

            {/* Main heading */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              About Digital Shop
            </h1>

            {/* Subtitle */}
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Empowering creators and connecting buyers in the world's most innovative digital marketplace
            </p>

            {/* Stats cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2 mx-auto" />
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">Global</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Worldwide Reach</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2 mx-auto" />
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">Community</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Trusted Creators</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <TrendingUp className="w-5 h-5 text-pink-600 dark:text-pink-400 mb-2 mx-auto" />
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">Growing</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Every Day</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
