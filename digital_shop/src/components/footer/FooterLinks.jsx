import { motion } from 'framer-motion'

export function FooterLinks({ type }) {
  const linkSections = {
    quick: {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' }
      ]
    },
    categories: {
      title: 'Categories',
      links: [
        { name: 'Ebooks', href: '/products?category=ebook' },
        { name: 'Courses', href: '/products?category=course' },
        { name: 'Templates', href: '/products?category=template' },
        { name: 'Photographs', href: '/products?category=photograph' },
        { name: 'Other', href: '/products?category=other' }
      ]
    }
  }

  const section = linkSections[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent uppercase tracking-wider text-xs mb-4">
        {section.title}
      </h3>
      <ul className="space-y-3">
        {section.links.map((link) => (
          <li key={link.name}>
            <motion.a
              whileHover={{ x: 5 }}
              href={link.href}
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm inline-block"
            >
              {link.name}
            </motion.a>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
