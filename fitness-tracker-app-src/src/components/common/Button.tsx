import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'delete';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-color text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-secondary-color text-white hover:bg-blue-400 focus:ring-blue-300',
    accent: 'bg-accent-color text-white hover:bg-pink-600 focus:ring-pink-500',
    outline: 'bg-transparent border border-primary-color text-primary-color hover:bg-primary-color hover:text-white focus:ring-blue-500',
    delete: 'bg-danger-color text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizeClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
