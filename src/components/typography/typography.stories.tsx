import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Typography } from './typography';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['heading-xl', 'heading-lg', 'body-main'],
      description: 'The visual style variant of the typography',
    },
    children: {
      control: 'text',
      description: 'Content to be rendered',
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default typography with heading-xl variant
 */
export const Default: Story = {
  args: {
    children: 'Card Heading',
    variant: 'heading-xl',
  },
};

/**
 * Large heading variant
 */
export const HeadingXL: Story = {
  args: {
    children: 'Card Heading',
    variant: 'heading-xl',
  },
};

/**
 * Medium heading variant
 */
export const HeadingLG: Story = {
  args: {
    children: 'Card Heading',
    variant: 'heading-lg',
  },
};

/**
 * Body text variant
 */
export const BodyMain: Story = {
  args: {
    children: 'Card Heading',
    variant: 'body-main',
  },
};

/**
 * Override semantic HTML element using `as` prop
 */
export const OverrideElement: Story = {
  args: {
    children: 'This is a paragraph that looks like a heading',
    variant: 'heading-xl',
    as: 'p',
  },
};
