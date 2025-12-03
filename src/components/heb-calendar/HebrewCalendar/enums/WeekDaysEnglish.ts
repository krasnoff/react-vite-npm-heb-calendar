export const WeekdaysEnglish = {
    Sunday: 'Sun',
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
} as const;

export type WeekdaysEnglish = typeof WeekdaysEnglish[keyof typeof WeekdaysEnglish];