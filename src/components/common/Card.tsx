// Reusable card component with hover animations and optional click handling
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Card component props interface
 * @property {React.ReactNode} children - Card content
 * @property {string} className - Additional CSS classes
 * @property {Function} onClick - Optional click handler
 * @property {boolean} hoverable - Whether to show hover effects
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

/**
 * Card component for displaying content in a contained, styled box
 * Features:
 * - Consistent styling with shadow and rounded corners
 * - Optional hover animations
 * - Click handler support
 * - Customizable through className prop
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.02, y: -5 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-white rounded-lg shadow-card
        ${hoverable ? 'transition-shadow hover:shadow-card-hover' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;