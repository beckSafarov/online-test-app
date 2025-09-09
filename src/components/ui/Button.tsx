import { ButtonHTMLAttributes, ReactNode } from 'react'
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary:
      'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm sm:text-base',
    lg: 'px-6 sm:px-8 py-3 text-sm sm:text-base',
  }

  const widthClass = fullWidth ? 'w-full sm:w-auto' : ''

  const finalClasses =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim()

  return (
    <button className={finalClasses} disabled={disabled || loading} {...props}>
      {loading ? (
        <div className='flex items-center justify-center'>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2'></div>
          Yuklanmoqda...
        </div>
      ) : (
        children
      )}
    </button>
  )
}
