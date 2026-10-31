import { AuthHeader } from '@components/auth/AuthHeader'
import { RegisterForm } from '@components/auth/RegisterForm'

export function RegisterPage() {
  return (
    <div className="space-y-6">
      <AuthHeader
        title="Create an account"
        subtitle="Start your journey as a buyer or seller"
      />
      <RegisterForm />
    </div>
  )
}
