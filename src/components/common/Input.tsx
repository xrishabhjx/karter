// Reusable input component with label, icon, and error handling support
import React, { forwardRef } from 'react';

/**
 * Input component props interface
 * @property {string} label - Optional label text
 * @property {string} error - Optional error message
 * @property {React.ReactNode} icon - Optional icon element
 * @property {boolean} fullWidth - Whether input should take full width
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Input component with built-in label and error handling
 * Features:
 * - Optional label
 * - Error message display
 * - Icon support
 * - Full width option
 * - Forwards ref to input element
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {/* Optional label */}
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        {/* Input container with optional icon */}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              block rounded-md shadow-sm border-gray-300 
              ${icon ? 'pl-10' : 'pl-4'} 
              py-2 pr-4 w-full
              focus:ring-primary focus:border-primary
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${className}
            `}
            {...props}
          />
        </div>
        
        {/* Error message */}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;