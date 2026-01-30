import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Typography component
 * @extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement>
 */
interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  /**
   * Visual style variant
   * @default 'heading-xl'
   */
  variant?: 'heading-xl' | 'heading-lg' | 'body-main';
  /**
   * Override the default semantic HTML element
   * @example
   * ```tsx
   * <Typography variant="heading-xl" as="p">Paragraph styled as heading</Typography>
   * ```
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  /**
   * Content to be rendered
   */
  children: React.ReactNode;
}

/**
 * Typography component with semantic HTML and style variants
 * 
 * Default semantic elements by variant:
 * - heading-xl → h2
 * - heading-lg → h3
 * - body-main → p
 * 
 * @example
 * ```tsx
 * <Typography variant="heading-xl">Large Heading</Typography>
 * <Typography variant="heading-lg">Medium Heading</Typography>
 * <Typography variant="body-main">Body text</Typography>
 * <Typography variant="heading-xl" as="p">Paragraph styled as heading</Typography>
 * ```
 */
export function Typography({ 
  variant = 'heading-xl',
  as,
  children,
  className,
  ...props 
}: TypographyProps) {
  const baseClasses = cn(
    // Base styles
    'w-full text-black',
    // Variant styles
    variant === 'heading-xl' && [
      'font-body',
      'text-[length:var(--font-size-xl)]',
      'leading-[var(--line-height-xl)]',
      'font-bold',
    ],
    variant === 'heading-lg' && [
      'font-heading',
      'text-[length:var(--font-size-lg)]',
      'leading-[var(--line-height-lg)]',
      'font-bold',
    ],
    variant === 'body-main' && [
      'font-body',
      'text-[length:var(--font-size-main)]',
      'leading-[var(--line-height-main)]',
      'font-normal',
    ],
    className
  );

  // Determine element: use `as` prop if provided, otherwise default based on variant
  const Component = as || (variant === 'heading-xl' ? 'h2' : variant === 'heading-lg' ? 'h3' : 'p');

  return (
    <Component className={baseClasses} {...props}>
      {children}
    </Component>
  );
}
