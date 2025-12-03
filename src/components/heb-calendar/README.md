# Getting Started with the React Hebrew Calendar component

This component is a simple calendar which displays the gergorian calendar and the hebrew calendar.
This component also shows the following:
1. Parashot Hashvua.
2. Jewish Events

In order to install this component simply execute the following command:
```
npm i hebrewcalendar
```

Here is how you implement the component in your react code
```tsx
import './App.css';
import Cal from 'hebrewcalendar/Cal';
import { DayObj } from 'hebrewcalendar/HebrewCalendar/interfaces/dayObj';
import { Language } from 'hebrewcalendar/HebrewCalendar/enums/language'; 

function App() {
  const selectDateHandler = (selectedDate: DayObj) => {
    console.log('selectDateHandler', selectedDate);
  }

  return (
    <div className="App">
      <div className="celendarContainer">
        <Cal 
          onSelectDate={(selectedDate) => selectDateHandler(selectedDate)} 
          language={Language.Hebrew}
        />
      </div>
    </div>
  );
}

export default App;
```

## Font Support

The Hebrew calendar component includes the Alef Hebrew font family for proper Hebrew text display. The fonts are automatically included when you install the package and import the styles.

### Font Files Included:
- `Alef-Regular.ttf` - Regular weight for Hebrew text
- `Alef-Bold.ttf` - Bold weight for Hebrew text
- `OFL.txt` - Open Font License

The fonts are automatically loaded via CSS `@font-face` declarations and applied to Hebrew text elements. No additional configuration is required - simply import the component styles and the fonts will be available.

This new component has the following attributes:
1. `onSelectDate` - This is a mandatory attributes which is activated every time the user chooses a specific date. Its argument is a `DayObj` interface which looks like this:
```
export interface DayObj {
    internationalDate: number;
    HebrewDate: HDate;
    DayOfWeek: number;
    ButtonDate: Date;
    ParashaShavua?: string;
    EventObj?: Array<Event>;
}
```

   - `internationalDate` - Day of the gregorian month
   - `HebrewDate` - An `HDate` object which describes the Hebrew date object which consists of the Hebrew month, Hebrew year, and Hebrew day. more details about the `HDate` object can be found at: https://github.com/hebcal/hebcal-es6#hdate
   - `DayOfWeek` - Day of the week where Sunday is 0 and Saturday is 6.
   - `ButtonDate` - Gregorian javascript date object.
   - `ParashaShavua` - weekly "Parashat Hashvua" in a string object.
   - `EventObj` - Special event object in the Jewish year. More details can be found at: https://github.com/hebcal/hebcal-es6#Event

2. `selectedDate` - optional, This attribute specifies a selected date of the Hebrew calendar component. if omitted then the current date is selected.
3. `language` - optional, language of the component.
```
export enum Language {
    Hebrew = 'he',
    English = 'en'
}
```
5. `format` - optional, general format of the component, large or small

The following attributes all all CSS customizing attributes and are React CSSProperties objects.

6. `customCalWrapper` - optional, CSS of the whole component
7. `customControllers` - optional, CSS of the top component
8. `customInputText` - optional, CSS of the input text which represents the year
9. `customSelect` - optional, CSS of the select month component
10. `customSelectOption` - optional, CSS of the select month options component
11. `customHebTitle` - optional, CSS of the custom Hebrew title
12. `customTable` - optional, CSS of the custom table
13. `customTr` - optional, CSS of the custom header row
14. `customDataTr` - optional, CSS of the custom data row
15. `customTd` - optional, CSS of the custom data cell
16. `customTh` - optional, CSS of the custom header cell
17. `customSpecialEvent` - optional, CSS of the custom special event cell
18. `customSaturday` - optional, CSS of the custom Saturday cell
19. `customSelectedDate` - optional, CSS of the custom selected date cell
20. `customButtonDateWrapper` - optional, CSS of the custom td inner content
21. `customDate` - optional, CSS of the custom day in month component
22. `customHebDate` - optional, CSS of the custom Hebrew day
23. `customGregDate` - optional, CSS of the custom Gregorian day
24. `customDesc` - optional, CSS of the custom description

If omitted then the default language is English.

## Final words
This component is based on the [hebcal-es6](https://github.com/hebcal/hebcal-es6) javascript library and has its [GPL-2.0 license](https://github.com/krasnoff/hebrew-canlendar/blob/master/LICENSE).

A working sample of this component can be seen [here](https://krasnoff.github.io/hebrew-canlendar/).

This component was made by Kobi Krasnoff.
