import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Badge = forwardRef(({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-primary text-white',
    secondary: 'bg-gradient-to-r from-secondary to-primary text-white',
    success: 'bg-gradient-success text-white',
    warning: 'bg-gradient-to-r from-warning to-yellow-600 text-white',
    error: 'bg-gradient-to-r from-error to-red-600 text-white',
    info: 'bg-gradient-to-r from-info to-blue-600 text-white',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium shadow-sm',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export default Badge