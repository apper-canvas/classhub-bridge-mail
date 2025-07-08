import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Card = forwardRef(({ className, variant = 'default', hover = false, children, ...props }, ref) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-card',
    gradient: 'bg-gradient-primary text-white shadow-lg',
    success: 'bg-gradient-success text-white shadow-lg',
    accent: 'bg-gradient-accent text-white shadow-lg',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg p-6 transition-all duration-200',
        variants[variant],
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card