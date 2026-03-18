import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="state-page">
      <div className="state-page__card">
        <span className="page-header__eyebrow">Routing</span>
        <h1>Page not found</h1>
        <p>The requested route does not exist in this ERP workspace.</p>
        <Link to="/dashboard" className="primary-button">
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
