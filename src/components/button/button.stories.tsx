import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';

/**
 * Storybook meta configuration for Button component
 * Displays button stories in the 'Components/Button' section
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary button variant with black background and white text
 */
export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};

/**
 * Secondary button variant with white background and black text
 */
export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
};
