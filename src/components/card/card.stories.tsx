import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card } from './card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-110">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card with standard heading, description, and primary button
 */
export const Default: Story = {
  args: {
    heading: 'Card Heading',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    buttonProps: {
      children: 'Button',
      variant: 'primary',
    },
  },
};

/**
 * Card with secondary button variant
 */
export const SecondaryButton: Story = {
  args: {
    heading: 'Card with Secondary Button',
    description: 'This card demonstrates the secondary button variant with white background and black text.',
    buttonProps: {
      children: 'Secondary Action',
      variant: 'secondary',
    },
  },
};

/**
 * Card with very long heading text to test text wrapping
 */
export const LongHeading: Story = {
  args: {
    heading: 'This is a Very Long Card Heading That Should Wrap to Multiple Lines When It Exceeds the Container Width',
    description: 'Testing how the card handles longer headings that need to wrap across multiple lines.',
    buttonProps: {
      children: 'Learn More',
    },
  },
};

/**
 * Card with very long description text to test text overflow
 */
export const LongDescription: Story = {
  args: {
    heading: 'Long Content Card',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    buttonProps: {
      children: 'Read More',
    },
  },
};

/**
 * Card with minimal content - short heading and description
 */
export const MinimalContent: Story = {
  args: {
    heading: 'Short Title',
    description: 'Brief description.',
    buttonProps: {
      children: 'Go',
    },
  },
};

/**
 * Card with custom button text
 */
export const CustomButtonText: Story = {
  args: {
    heading: 'Get Started Today',
    description: 'Join thousands of users who are already using our platform to achieve their goals.',
    buttonProps: {
      children: 'Sign Up Now',
    },
  },
};
