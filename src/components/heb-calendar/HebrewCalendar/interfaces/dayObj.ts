import { HDate, Event } from "@hebcal/core";

export interface DayObj {
    internationalDate: number;
    HebrewDate: HDate;
    DayOfWeek: number;
    ButtonDate: Date;
    ParashaShavua?: string;
    EventObj?: Array<Event>;
}