import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'

export function ContactSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Contact Section */}
      <div>
        <h3 className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent uppercase tracking-wider text-xs mb-4">
          Contact
        </h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="h-8 w-8 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            <a href="mailto:hello@digitalshop.marketplace" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
              digitalshopmarketplace.com
            </a>
          </li>
          <li className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="h-8 w-8 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <a href="tel:+1234567890" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
              +93 73 000 033 3
            </a>
          </li>
          <li className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="h-8 w-8 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
            </motion.div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              Kabul, Afghanistan
            </span>
          </li>
        </ul>
      </div>
    </motion.div>
  )
}
