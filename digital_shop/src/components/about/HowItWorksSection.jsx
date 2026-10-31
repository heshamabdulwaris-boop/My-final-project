import { motion } from 'framer-motion'
import { Layers, Search, Shield, Download, Sparkles } from 'lucide-react'

const gradientColors = [
  'from-blue-500 via-cyan-500 to-teal-500',
  'from-purple-500 via-violet-500 to-fuchsia-500',
  'from-orange-500 via-amber-500 to-yellow-500',
  'from-emerald-500 via-green-500 to-teal-500'
]

export function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: 'Creators Upload Products',
      description: 'Easily upload your digital products with our simple and intuitive interface.',
      icon: Layers,
    },
    {
      step: 2,
      title: 'Customers Discover Products',
      description: 'Buyers browse and discover your products through our marketplace search and categories.',
      icon: Search,
    },
    {
      step: 3,
      title: 'Secure Purchase',
      description: 'Secure payment processing ensures safe transactions for both creators and buyers.',
      icon: Shield,
    },
    {
      step: 4,
      title: 'Instant Download Access',
      description: 'Buyers get immediate access to their purchased files with automated delivery.',
      icon: Download,
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple steps to start selling and buying digital products
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }} />
                </div>

                <motion.div
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ duration: 0.6 }}
                  className={`relative w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-gray-800`}
                >
                  <step.icon className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs font-bold text-indigo-600">{step.step}</span>
                  </div>
                </motion.div>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
