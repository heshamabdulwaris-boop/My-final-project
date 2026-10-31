import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative overflow-hidden">

      <div className="w-full max-w-sm relative z-10">
        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col border border-indigo-100 dark:border-indigo-900/30"
        >
          {/* Close Button */}
          <div className="flex-shrink-0 p-4 pb-0">
            <Link 
              to="/" 
              className="float-right p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Link>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
