import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export function FooterBottom() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="pt-8 border-t border-gray-200"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Copyright */}
        <p className="text-gray-600 text-sm">
          © {currentYear} Digital Shop. All rights reserved.
        </p>

        {/* Middle Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <a href="/terms" className="hover:text-indigo-600 transition-colors">
            Terms of Service
          </a>
          <a href="/privacy" className="hover:text-indigo-600 transition-colors">
            Privacy Policy
          </a>
          <a href="/cookies" className="hover:text-indigo-600 transition-colors">
            Cookie Policy
          </a>
        </div>

        {/* Back to Top Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Built With Message */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-gray-500">
          Built with React, Tailwind CSS, and Framer Motion
        </p>
      </motion.div>
    </motion.div>
  )
}
