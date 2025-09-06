import { ReactNode } from 'react'
export interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: boolean
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  shadow = true,
}: CardProps) {
  const baseClasses = 'bg-white border border-gray-200 rounded-lg'

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-6 sm:p-8 lg:p-10',
  }

  const shadowClass = shadow ? 'shadow-sm' : ''

  const finalClasses =
    `${baseClasses} ${paddingClasses[padding]} ${shadowClass} ${className}`.trim()

  return <div className={finalClasses}>{children}</div>
}
