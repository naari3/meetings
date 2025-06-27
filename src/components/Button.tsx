import { ReactNode } from 'react'

interface ButtonProps {
  variant: 'navigation' | 'viewToggle'
  active?: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}

export default function Button({ variant, active = false, onClick, children, className = '' }: ButtonProps) {
  const baseStyles = 'font-medium transition-all duration-200'
  
  const variantStyles = {
    navigation: 'p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50',
    viewToggle: `px-3 py-2 rounded-lg text-sm ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`
  }
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}