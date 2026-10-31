import { motion } from 'framer-motion'
import { Lightbulb, Shield, Lock, Globe, Eye, Users, Sparkles } from 'lucide-react'

const gradientColors = [
  'from-yellow-500 via-amber-500 to-orange-500',
  'from-blue-500 via-cyan-500 to-teal-500',
  'from-green-500 via-emerald-500 to-teal-500',
  'from-purple-500 via-violet-500 to-fuchsia-500',
  'from-pink-500 via-rose-500 to-red-500',
  'from-indigo-500 via-blue-500 to-cyan-500'
]

export function CoreValuesSection() {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge technology and creative solutions.',
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'Building lasting relationships through transparency, reliability, and integrity.',
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Protecting our users with industry-leading security measures and data protection.',
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Making digital commerce accessible to creators and buyers worldwide.',
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Open communication and clear policies that foster confidence in our platform.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Nurturing a supportive ecosystem where creators and buyers thrive together.',
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
            Core Values
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-500 h-full relative overflow-hidden">
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
                  className={`relative w-20 h-20 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} rounded-2xl flex items-center justify-center mb-6 shadow-xl ring-4 ring-white dark:ring-gray-800`}
                >
                  <value.icon className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="h-3 w-3 text-indigo-500" />
                  </div>
                </motion.div>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{value.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>

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
