import Link from 'next/link'
import { ReactNode } from 'react'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Breadcrumb[]
  actions?: ReactNode
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <svg className="w-4 h-4 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {breadcrumb.href ? (
                  <Link href={breadcrumb.href} className="text-gray-500 hover:text-gray-700">
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{breadcrumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-lg text-gray-600">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
} 