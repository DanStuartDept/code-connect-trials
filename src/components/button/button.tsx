import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Button component
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
}

/**
 * Button component with primary and secondary variants
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 * 
 * @param props - Button properties
 * @returns A styled button element
 */
export const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        'cursor-pointer inline-flex items-center justify-center px-4 py-1 text-lg font-semibold border border-black',
        variant === 'primary' && 'bg-black text-white',
        variant === 'secondary' && 'bg-white text-black',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
