import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="state-page">
      <div className="state-page__card">
        <span className="page-header__eyebrow">Access</span>
        <h1>Access denied</h1>
        <p>You do not have access to open this area.</p>
        <Link to="/dashboard" className="primary-button">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
