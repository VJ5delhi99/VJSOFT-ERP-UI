import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { InputField } from '../components/FormField'
import { apiConfig } from '../config/api'
import { demoAccounts } from '../demo/demoAuth'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { normalizeApiError } from '../services/apiClient'
import { platformService } from '../services/platformService'
import type { DemoStatusDto } from '../types'

interface LoginFormValues {
  username: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, status } = useAuth()
  const { showToast } = useToast()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [demoStatus, setDemoStatus] = useState<DemoStatusDto | null>(null)
  const [pendingDemoAccount, setPendingDemoAccount] = useState<string | null>(null)
  const isDemoMode = apiConfig.demoModeEnabled || demoStatus?.isEnabled
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: '',
      password: ''
    }
  })

  useEffect(() => {
    let isMounted = true

    async function loadDemoStatus() {
      try {
        const status = await platformService.getDemoStatus()
        if (isMounted) {
          setDemoStatus(status)
        }
      } catch {
        if (isMounted) {
          setDemoStatus(null)
        }
      }
    }

    void loadDemoStatus()

    return () => {
      isMounted = false
    }
  }, [])

  async function signIn(userNameOrEmail: string, password: string) {
    const redirectPath = (location.state as { from?: string } | null)?.from || '/dashboard'
    setSubmitError(null)

    try {
      await login(userNameOrEmail, password)
      navigate(redirectPath, { replace: true })
    } catch (error) {
      const normalizedError = normalizeApiError(error)
      setSubmitError(normalizedError.message)
      showToast('Sign in failed', normalizedError.message, 'danger')
    }
  }

  async function onSubmit(values: LoginFormValues) {
    setPendingDemoAccount(null)
    await signIn(values.username, values.password)
  }

  async function signInWithDemoAccount(account: (typeof demoAccounts)[number]) {
    setPendingDemoAccount(account.userNameOrEmail)
    await signIn(account.userNameOrEmail, account.password)
    setPendingDemoAccount(null)
  }

  return (
    <div className="auth-page">
      <section className="auth-page__hero">
        <div className="auth-page__intro">
          <span className="page-header__eyebrow">Edgeonix ERP</span>
          <h1>Run revenue, operations, finance, and service from one connected business platform.</h1>
          <p>Sign in to manage daily work, review business performance, and keep every team operating from the same source of truth.</p>
        </div>

        <div className="auth-page__highlights">
          <article>
            <strong>Access by role</strong>
            <p>Each person sees the pages and actions that match their responsibilities and approvals.</p>
          </article>
          <article>
            <strong>Connected workflows</strong>
            <p>Sales, stock, purchasing, finance, and service stay connected across one organization-wide system.</p>
          </article>
          <article>
            <strong>Operational visibility</strong>
            <p>Dashboards, alerts, and audit history help teams spot priorities and act with confidence.</p>
          </article>
        </div>
      </section>

      <section className="auth-page__panel">
        <div className="auth-card">
          <span className="page-header__eyebrow">Sign in</span>
          <h2>Access your organization</h2>
          <p>Use your business email or username to continue.</p>

          <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Email or username"
              placeholder="Enter your email or username"
              autoComplete="username"
              error={errors.username?.message}
              registration={register('username', { required: 'Please enter your email or username.' })}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              error={errors.password?.message}
              registration={register('password', { required: 'Please enter your password.' })}
            />
            {submitError ? <div className="form-alert form-alert--danger">{submitError}</div> : null}
            <button type="submit" className="primary-button" disabled={status === 'loading'}>
              {status === 'loading' ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {isDemoMode ? (
            <div className="auth-card__demo">
              <div className="auth-card__demo-copy">
                <strong>Explore the sample organization</strong>
                <p>Demo mode is enabled. Use any sample login below to open a fully working in-browser business scenario without live API access.</p>
              </div>
              <div className="auth-card__demo-credentials">
                {demoAccounts.map((account) => (
                  <div key={`${account.label}-credentials`} className="auth-card__demo-credential">
                    <strong>{account.label}</strong>
                    <span>User ID: {account.userNameOrEmail}</span>
                    <span>Password: {account.password}</span>
                    <small>{account.description}</small>
                  </div>
                ))}
              </div>
              <div className="demo-login-grid">
                {demoAccounts.map((account) => {
                  const isCurrent = pendingDemoAccount === account.userNameOrEmail

                  return (
                    <button
                      key={account.userNameOrEmail}
                      type="button"
                      className="demo-login-button"
                      disabled={status === 'loading'}
                      onClick={() => void signInWithDemoAccount(account)}
                    >
                      <span>{isCurrent && status === 'loading' ? `Signing in as ${account.label}...` : `Demo ${account.label}`}</span>
                      <small>{account.description}</small>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          <div className="auth-card__footer">
            <span>Need help signing in?</span>
            <strong>Contact your organization administrator</strong>
          </div>
        </div>
      </section>
    </div>
  )
}
