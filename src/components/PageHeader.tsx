import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { buildBreadcrumbs } from '../config/navigation'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}

export default function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  const { pathname } = useLocation()
  const breadcrumbs = buildBreadcrumbs(pathname)

  return (
    <div className="page-header">
      <div className="page-header__content">
        <nav className="page-header__breadcrumbs" aria-label="Breadcrumb">
          <ol>
            {breadcrumbs.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                {item.path ? <Link to={item.path}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow ? <span className="page-header__eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="page-header__actions">{actions}</div> : null}
    </div>
  )
}
