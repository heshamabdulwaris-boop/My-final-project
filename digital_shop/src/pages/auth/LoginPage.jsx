import { AuthHeader } from '@components/auth/AuthHeader'
import { LoginForm } from '@components/auth/LoginForm'

export function LoginPage() {
  return (
    <div className="space-y-6">
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to your account to continue"
      />
      <LoginForm />
    </div>
  )
}
