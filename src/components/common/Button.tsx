// Reusable button component with variants, animations, and icon support
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Button component props interface
 * @property {React.ReactNode} children - Button content
 * @property {string} variant - Button style variant
 * @property {string} size - Button size
 * @property {boolean} fullWidth - Whether button should take full width
 * @property {boolean} disabled - Whether button is disabled
 * @property {Function} onClick - Click handler
 * @property {string} type - Button type (button, submit, reset)
 * @property {string} className - Additional CSS classes
 * @property {React.ReactNode} icon - Optional icon element
 */
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Button component with multiple variants and animations
 * Features:
 * - Multiple style variants (primary, secondary, outline, text)
 * - Different sizes (sm, md, lg)
 * - Optional full width
 * - Disabled state
 * - Icon support
 * - Framer Motion animations
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon,
}) => {
  // Base classes for consistent button styling
  const baseClasses = 'rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Style variants for different button types
  const variantClasses = {
    primary: 'bg-primary text-secondary hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
    outline: 'border border-secondary text-secondary hover:bg-secondary hover:text-white focus:ring-secondary',
    text: 'text-secondary hover:bg-gray-100 focus:ring-secondary',
  };
  
  // Size variants for different button sizes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Additional utility classes
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <motion.button
      type={type}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className} ${icon ? 'flex items-center justify-center' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;