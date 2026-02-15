import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { FixedDesignCal } from './FixDesignCal';
import { Language } from '../../enums/language';
import { Format } from '../../enums/format';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/FixedDesignCal',
  component: FixedDesignCal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { 
    language: Language.Hebrew,
    onSelectDate: fn() 
  },
} satisfies Meta<typeof FixedDesignCal>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    
  },
};

export const Secondary: Story = {
  args: {
    format: Format.SMALL
  },
};

export const English: Story = {
  args: {
    language: Language.English
  },
};

export const SmallEnglish: Story = {
  args: {
    language: Language.English,
    format: Format.SMALL
  },
};

export const CustomSelectedDate: Story = {
  args: {
    selectedDate: new Date(2024, 4, 20) // May 20, 2024
  },
};
