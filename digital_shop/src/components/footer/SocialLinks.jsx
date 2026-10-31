import { motion } from 'framer-motion'
import { Code, Link } from 'lucide-react'

export function SocialLinks() {
  const socialLinks = [
    { icon: Link, href: '#', label: 'LinkedIn' },
    { icon: Code, href: '#', label: 'GitHub' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex gap-3"
    >
      {socialLinks.map((social) => (
        <motion.a
          key={social.label}
          href={social.href}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-indigo-600 hover:text-white transition-colors text-gray-700 dark:text-gray-300"
          aria-label={social.label}
        >
          <social.icon className="h-5 w-5" />
        </motion.a>
      ))}
    </motion.div>
  )
}
