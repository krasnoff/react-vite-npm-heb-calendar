export const WeekdaysHebrew = {
    Sunday: 'א',
    Monday: 'ב',
    Tuesday: 'ג',
    Wednesday: 'ד',
    Thursday: 'ה',
    Friday: 'ו',
    Saturday: 'ש',
} as const;

export type WeekdaysHebrew = typeof WeekdaysHebrew[keyof typeof WeekdaysHebrew];