import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../button';

/**
 * Props for the Card component
 * @extends React.HTMLAttributes<HTMLDivElement>
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The heading text displayed at the top of the card
   */
  heading: string;

  /**
   * The description text displayed below the heading
   */
  description: string;

  /**
   * Props to pass to the Button component
   * @default { children: 'Button', variant: 'primary' }
   */
  buttonProps?: React.ComponentProps<typeof Button>;
}

/**
 * Card component with heading, description, and action button
 * 
 * @example
 * ```tsx
 * <Card
 *   heading="Card Heading"
 *   description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
 *   buttonProps={{ children: 'Learn More', variant: 'secondary' }}
 * />
 * ```
 * 
 * @param props - Card properties
 * @returns A styled card element with heading, description, and button
 */
export const Card = ({
  heading,
  description,
  buttonProps = { children: 'Button', variant: 'primary' },
  className,
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white flex flex-col gap-5 items-start p-5 w-full',
        className
      )}
      {...props}
    >
      <h2 className="font-bold text-2xl leading-8 text-black whitespace-pre-wrap w-full">
        {heading}
      </h2>
      <p className="font-normal leading-6 text-base text-(--color-grey-dark) max-w-[672px] w-full whitespace-pre-wrap">
        {description}
      </p>
      <Button {...buttonProps} />
    </div>
  );
};
