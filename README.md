# Hebrew Calendar Component (Cal)

A fully-featured React Hebrew calendar component that displays both Gregorian and Hebrew dates with Jewish holidays and events. Built with TypeScript and supports both Hebrew and English languages.

## Features

- 📅 Dual calendar display (Gregorian & Hebrew dates)
- 🎯 Hebrew date selection with callback support
- 🎨 Customizable styling with CSS properties
- 🌍 Multi-language support (Hebrew/English)
- 📱 Responsive design with small format option
- 🕯️ Jewish holidays and special events integration
- ♿ Accessibility support with ARIA labels

## Installation

### NPM

```bash
npm i @krasnoff/react-vite-heb-calendar
```

### Yarn

```bash
yarn add @krasnoff/react-vite-heb-calendar
```

### PNPM

```bash
pnpm add @krasnoff/react-vite-heb-calendar
```

## Basic Usage

### 1. Import the Component and Styles

```tsx
import React from 'react';
import { Cal, Language, Format, type DayObj } from 'react-vite-heb-calendar';
import 'react-vite-heb-calendar/styles';

function App() {
  const handleDateSelect = (selectedDate: DayObj) => {
    console.log('Selected date:', selectedDate);
  };

  return (
    <Cal
      language={Language.Hebrew}
      onSelectDate={handleDateSelect}
    />
  );
}

export default App;
```

### 2. With Custom Styling

```tsx
import React from 'react';
import { Cal, Language, Format, type DayObj } from 'react-vite-heb-calendar';
import 'react-vite-heb-calendar/styles';

function CustomCalendar() {
  const handleDateSelect = (selectedDate: DayObj) => {
    console.log('Selected Hebrew date:', selectedDate.HebrewDate);
    console.log('Selected Gregorian date:', selectedDate.ButtonDate);
    console.log('Jewish events:', selectedDate.EventObj);
  };

  return (
    <Cal
      language={Language.Hebrew}
      format={Format.LARGE}
      selectedDate={new Date()}
      onSelectDate={handleDateSelect}
      customCalWrapper={{
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}
      customTable={{
        border: '2px solid #007bff',
        borderRadius: '8px'
      }}
      customSelectedDate={{
        backgroundColor: '#007bff',
        color: 'white'
      }}
      customSaturday={{
        backgroundColor: '#f8f9fa'
      }}
      customSpecialEvent={{
        backgroundColor: '#fff3cd',
        borderLeft: '4px solid #ffc107'
      }}
    />
  );
}
```

### 3. English Version with Small Format

```tsx
import React from 'react';
import { Cal, Language, Format, type DayObj } from 'react-vite-heb-calendar';
import 'react-vite-heb-calendar/styles';

function EnglishCalendar() {
  const handleDateSelect = (selectedDate: DayObj) => {
    alert(`Selected: ${selectedDate.ButtonDate.toDateString()}`);
  };

  return (
    <Cal
      language={Language.English}
      format={Format.SMALL}
      onSelectDate={handleDateSelect}
    />
  );
}
```

## Props API

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `onSelectDate` | `(selectedDate: DayObj) => void` | Callback function when user selects a date |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `Language.Hebrew \| Language.English` | `Language.English` | Sets the language of the component |
| `selectedDate` | `Date` | `new Date()` | Default selected date |
| `format` | `Format.LARGE \| Format.SMALL` | `Format.LARGE` | Size format of the component |

### Custom Styling Props

All styling props are optional `CSSProperties` objects:

| Prop | Description |
|------|-------------|
| `customCalWrapper` | Style for the main calendar wrapper |
| `customControllers` | Style for the month/year controls |
| `customInputText` | Style for the year input field |
| `customSelect` | Style for the month select dropdown |
| `customSelectOption` | Style for month select options |
| `customHebTitle` | Style for the Hebrew month title |
| `customTable` | Style for the calendar table |
| `customTr` | Style for header rows |
| `customDataTr` | Style for date rows |
| `customTh` | Style for header cells |
| `customTd` | Style for date cells |
| `customSpecialEvent` | Style for cells with Jewish holidays |
| `customSaturday` | Style for Saturday cells |
| `customSelectedDate` | Style for the selected date cell |
| `customButtonDateWrapper` | Style for the clickable date wrapper |
| `customDate` | Style for the date number container |
| `customHebDate` | Style for Hebrew date numbers |
| `customGregDate` | Style for Gregorian date numbers |
| `customDesc` | Style for event descriptions |

## Types and Enums

### DayObj Interface

```tsx
interface DayObj {
  internationalDate: number;        // Gregorian date number
  ButtonDate: Date;                // Full Date object
  DayOfWeek: number;               // Day of week (0-6)
  HebrewDate: HDate;               // Hebrew date object from @hebcal/core
  EventObj: Event[];               // Array of Jewish events/holidays
}
```

### Language Enum

```tsx
enum Language {
  Hebrew = "hebrew",
  English = "english"
}
```

### Format Enum

```tsx
enum Format {
  LARGE = "large",
  SMALL = "small"
}
```

## Advanced Examples

### Working with Hebrew Dates

```tsx
import { Cal, type DayObj } from 'react-vite-heb-calendar';
import { gematriya } from '@hebcal/core';

function HebrewDateHandler() {
  const handleDateSelect = (selectedDate: DayObj) => {
    const hebrewDate = selectedDate.HebrewDate;
    
    // Get Hebrew date components
    const hebrewDay = hebrewDate.getDate();
    const hebrewMonth = hebrewDate.getMonthName();
    const hebrewYear = hebrewDate.getFullYear();
    
    // Format using gematriya (Hebrew numerals)
    const formattedDay = gematriya(hebrewDay);
    const formattedYear = gematriya(hebrewYear);
    
    console.log(`Hebrew Date: ${formattedDay} ${hebrewMonth} ${formattedYear}`);
    
    // Check for Jewish holidays
    if (selectedDate.EventObj.length > 0) {
      selectedDate.EventObj.forEach(event => {
        console.log('Jewish Holiday/Event:', event.render());
      });
    }
  };

  return <Cal onSelectDate={handleDateSelect} />;
}
```

### Responsive Design

```tsx
import React, { useState, useEffect } from 'react';
import { Cal, Format, type DayObj } from 'react-vite-heb-calendar';

function ResponsiveCalendar() {
  const [format, setFormat] = useState(Format.LARGE);

  useEffect(() => {
    const handleResize = () => {
      setFormat(window.innerWidth < 768 ? Format.SMALL : Format.LARGE);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDateSelect = (selectedDate: DayObj) => {
    console.log('Selected:', selectedDate);
  };

  return (
    <Cal
      format={format}
      onSelectDate={handleDateSelect}
      customCalWrapper={{
        width: '100%',
        maxWidth: format === Format.SMALL ? '300px' : '600px'
      }}
    />
  );
}
```

## Dependencies

This component relies on:

- **React** (>=18): Peer dependency
- **@hebcal/core**: For Hebrew calendar calculations and Jewish holidays

Make sure your project has React 18 or higher installed.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

The component includes:

- ARIA labels for form controls
- Keyboard navigation support (Enter key for date selection)
- Semantic HTML structure
- Screen reader friendly content

## Development

To contribute or run locally:

```bash
# Clone the repository
git clone <repository-url>
cd react-vite-npm-heb-calendar

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please read the contributing guidelines and submit pull requests to the main repository.

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/krasnoff/react-vite-npm-heb-calendar).
