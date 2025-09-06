import { ReactNode } from 'react'
interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export default function Container({
  children,
  className = '',
  size = 'lg',
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-sm', // 384px
    md: 'max-w-2xl', // 672px
    lg: 'max-w-4xl', // 896px
    xl: 'max-w-6xl', // 1152px
    full: 'max-w-full', // 100%
  }

  return (
    <div
      className={`container mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
    >
      {children}
    </div>
  )
}
