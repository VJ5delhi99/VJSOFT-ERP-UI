import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { InputField } from '../components/FormField'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

interface LoginFormValues {
  username: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, status } = useAuth()
  const { showToast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: 'admin',
      password: 'ChangeMe!123!'
    }
  })

  async function onSubmit(values: LoginFormValues) {
    const redirectPath = (location.state as { from?: string } | null)?.from || '/dashboard'

    try {
      await login(values.username, values.password)
      navigate(redirectPath, { replace: true })
    } catch {
      showToast('Sign in failed', 'Use the AuthService seed account or a valid backend identity.', 'danger')
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-page__hero">
        <span className="page-header__eyebrow">Modern ERP Workspace</span>
        <h1>Operate finance, inventory, tenants, and orders from one control surface.</h1>
        <p>
          The frontend is structured for microservice backends, role-aware access, and AI-ready insights without coupling
          modules together.
        </p>

        <div className="auth-page__highlights">
          <article>
            <strong>Role-aware access</strong>
            <p>Navigation, pages, and actions follow backend roles and permissions instead of frontend-only assumptions.</p>
          </article>
          <article>
            <strong>Microservice ready</strong>
            <p>Each module uses its own API service contract with centralized auth, error handling, and env config.</p>
          </article>
          <article>
            <strong>AI surfaces included</strong>
            <p>Dashboard insights, anomaly flags, and Ask ERP are prepared for future ML or LLM services.</p>
          </article>
        </div>
      </section>

      <section className="auth-page__panel">
        <div className="auth-card">
          <span className="page-header__eyebrow">Sign in</span>
          <h2>Access your ERP workspace</h2>
          <p>Development seed account: admin or admin@erp.local</p>

          <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Username"
              placeholder="Enter role or email"
              error={errors.username?.message}
              registration={register('username', { required: 'Username is required.' })}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="Enter password"
              error={errors.password?.message}
              registration={register('password', { required: 'Password is required.' })}
            />
            <button type="submit" className="primary-button" disabled={status === 'loading'}>
              {status === 'loading' ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="auth-card__footer">
            <span>Development seed password</span>
            <strong>ChangeMe!123!</strong>
          </div>
        </div>
      </section>
    </div>
  )
}
