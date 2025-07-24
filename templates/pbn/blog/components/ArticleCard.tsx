import React from 'react'
import Link from 'next/link'

interface ArticleCardProps {
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  readTime?: string
  category?: string
  image?: string
  domain: string
}

export default function ArticleCard({
  title,
  excerpt,
  slug,
  publishedAt,
  readTime = '5 min read',
  category,
  image,
  domain
}: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {image && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
      
      <div className="p-6">
        {category && (
          <div className="flex items-center mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {category}
            </span>
          </div>
        )}
        
        <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
          <Link 
            href={`/articles/${slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>
        </h2>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <time dateTime={publishedAt}>
            {formatDate(publishedAt)}
          </time>
          <span>{readTime}</span>
        </div>
        
        <div className="mt-4">
          <Link 
            href={`/articles/${slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Read more
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
} 