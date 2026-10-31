import { motion } from 'framer-motion'
import logo from '@assets/logo/dp logo.png'

export function FooterBrand() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="Digital Shop Logo"
          className="h-8 w-auto rounded-xl"
        />
        <span className="text-base font-semibold bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Digital Shop</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        A modern marketplace for creators, developers, designers, and digital entrepreneurs to buy and sell premium digital products.
      </p>
    </motion.div>
  )
}
