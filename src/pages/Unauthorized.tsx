import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="state-page">
      <div className="state-page__card">
        <span className="page-header__eyebrow">Access control</span>
        <h1>Access denied</h1>
        <p>Your current role does not have permission to open this module.</p>
        <Link to="/dashboard" className="primary-button">
          Return to dashboard
        </Link>
      </div>
    </div>
  )
}
