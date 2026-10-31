import { motion } from 'framer-motion'
import { ExternalLink, Globe, Sparkles, Award, MessageCircle } from 'lucide-react'

const gradientColors = [
  'from-pink-500 via-rose-500 to-red-500',
  'from-blue-500 via-cyan-500 to-teal-500',
  'from-purple-500 via-violet-500 to-fuchsia-500',
  'from-orange-500 via-amber-500 to-yellow-500'
]

export function TeamSection() {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Passionate about empowering creators and building the future of digital commerce.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
      badge: 'Leader',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Technology enthusiast focused on building scalable and secure platforms.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
      },
      badge: 'Tech Expert',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      bio: 'Dedicated to creating intuitive user experiences and innovative product features.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
      badge: 'Product Visionary',
    },
    {
      name: 'David Park',
      role: 'Head of Design',
      bio: 'Creative designer passionate about crafting beautiful and functional interfaces.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
      },
      badge: 'Design Master',
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
            Meet Our Team
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The passionate people behind Digital Shop
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-500 h-full relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }} />
                </div>

                <div className="relative h-80">
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors[index % gradientColors.length]}`} />
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover mix-blend-overlay opacity-90 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30"
                  >
                    <div className="flex items-center gap-1.5">
                      <Award className="h-3 w-3 text-white" />
                      <span className="text-xs font-semibold text-white">{member.badge}</span>
                    </div>
                  </motion.div>
                </div>
                <div className="p-6 relative z-10">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{member.name}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-3 text-sm">{member.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{member.bio}</p>
                  <div className="flex gap-3">
                    {member.socialLinks?.linkedin && (
                      <motion.a
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800/50 dark:hover:to-purple-800/50 transition-all duration-300"
                        aria-label="LinkedIn"
                      >
                        <ExternalLink className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </motion.a>
                    )}
                    {member.socialLinks?.twitter && (
                      <motion.a
                        whileHover={{ scale: 1.15, rotate: -5 }}
                        whileTap={{ scale: 0.95 }}
                        href={member.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl hover:from-blue-200 hover:to-cyan-200 dark:hover:from-blue-800/50 dark:hover:to-cyan-800/50 transition-all duration-300"
                        aria-label="Twitter"
                      >
                        <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </motion.a>
                    )}
                    {member.socialLinks?.github && (
                      <motion.a
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        href={member.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/30 dark:to-slate-800/30 rounded-xl hover:from-gray-200 hover:to-slate-200 dark:hover:from-gray-700/50 dark:hover:to-slate-700/50 transition-all duration-300"
                        aria-label="GitHub"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </motion.a>
                    )}
                  </div>
                </div>

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
