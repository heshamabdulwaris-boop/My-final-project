import { Outlet } from 'react-router-dom'
import { NetworkBackground } from '@components/auth/NetworkBackground'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <NetworkBackground />
      <div className="w-full max-w-md relative z-10 px-4">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
