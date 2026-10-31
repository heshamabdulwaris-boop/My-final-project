import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { FooterBrand } from './FooterBrand'
import { FooterLinks } from './FooterLinks'
import { ContactSection } from './ContactSection'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <FooterBrand />
          </div>

          {/* Quick Links Column */}
          <div>
            <FooterLinks type="quick" />
          </div>

          {/* Categories Column */}
          <div>
            <FooterLinks type="categories" />
          </div>

          {/* Contact & Newsletter Column */}
          <div>
            <ContactSection />
          </div>
        </div>
      </div>

      {/* Back to Top Button and Copyright */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Digital Shop. All rights reserved.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#635BFF] text-white rounded-xl hover:bg-[#4F47E6] transition-colors duration-200 font-semibold text-sm"
          >
            Back to Top
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
