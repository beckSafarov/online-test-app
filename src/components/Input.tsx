import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  required,
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  const inputClasses = `
    px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
    }
    ${fullWidth ? 'w-full' : ''}
    ${props.disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
    ${className}
  `.trim()

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className='block text-sm font-medium text-gray-700 mb-2'>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className='mt-1 text-sm text-red-600'>{error}</p>
      )}
      {helperText && !error && (
        <p className='mt-1 text-sm text-gray-500'>{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
