import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="state-page">
      <div className="state-page__card">
        <span className="page-header__eyebrow">Page</span>
        <h1>Page not found</h1>
        <p>We couldn't find that page in this organization.</p>
        <Link to="/dashboard" className="primary-button">
          Go to overview
        </Link>
      </div>
    </div>
  )
}
