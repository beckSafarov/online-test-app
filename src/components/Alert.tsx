import { ReactNode } from 'react'
import { InfoIcon, SuccessIcon, WarningIcon, ErrorIcon } from './Icons'

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: ReactNode
  icon?: boolean
  className?: string
}

export default function Alert({
  variant = 'info',
  title,
  children,
  icon = true,
  className = ''
}: AlertProps) {
  const baseClasses = 'border rounded-lg p-4'
  
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  }
  
  const iconClasses = {
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  }
  
  const icons = {
    info: <InfoIcon />,
    success: <SuccessIcon />,
    warning: <WarningIcon />,
    error: <ErrorIcon />,
  }
  
  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()
  
  return (
    <div className={finalClasses}>
      <div className={icon ? 'flex items-start' : ''}>
        {icon && (
          <div className='flex-shrink-0'>
            <div className={`mt-0.5 ${iconClasses[variant]}`}>
              {icons[variant]}
            </div>
          </div>
        )}
        <div className={icon ? 'ml-3' : ''}>
          {title && (
            <h3 className='text-sm font-medium mb-1'>{title}</h3>
          )}
          <div className='text-sm'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
