import { useCallback, useEffect, useRef, useState } from "react";
import { Language, MonthsArr, WeekdaysEnglish, WeekdaysHebrew, type DayObj, type WeekDateArray } from "../components/heb-calendar";
import { HebrewCalendar, Location, Event, HDate } from "@hebcal/core";

function useCalendar(selectedDateArg?: Date, languageArg?: string, onSelectDateArg?: (date: DayObj) => void) {
    const [SelectedEnum, setSelectedEnum] = useState<Array<WeekdaysHebrew | WeekdaysEnglish>>()
    const [MonthDates, setMonthDates] = useState<Array<WeekDateArray>>([]);
    const [FirstDayMonth, setFirstDayMonth] = useState<DayObj>();
    const [LastDayMonth, setLastDayMonth] = useState<DayObj>();
    const [selectedYear, setSelectedYear] = useState<number>(selectedDateArg ? selectedDateArg.getFullYear() : (new Date()).getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(selectedDateArg ? selectedDateArg.getMonth() : (new Date()).getMonth());
    const selectedYearContainer = useRef<HTMLInputElement>(null);
    const selectedMonthContainer = useRef<HTMLSelectElement>(null);
    const [selectedDate, setSelectedDate] = useState<DayObj>();
    
    //#region inner functions
    
    // build the whole calendar object
    const buildMonthObj = (buildDateObj: Array<DayObj>): Array<WeekDateArray> => {
        let weeksArr: WeekDateArray = [];
        const monthArr: Array<WeekDateArray> = [];
        let buildDateObjIndex = 0;
        
        
        // first week of the month
        const firstDayOfWeek = buildDateObj[0].DayOfWeek;
        for (let index = 0; index < 7; index++) {
            if (index < firstDayOfWeek) {
                weeksArr.push(undefined);
            } else {
                weeksArr.push(buildDateObj[buildDateObjIndex]);
                buildDateObjIndex++;
            }
        }
        monthArr.push(weeksArr);
        
        do {
            weeksArr = [];

            for (let index = 0; index < 7; index++) {
                const thisDate = buildDateObj[buildDateObjIndex]
                weeksArr.push(thisDate);
                buildDateObjIndex++;
            }
            monthArr.push(weeksArr);
        } while (buildDateObjIndex < buildDateObj.length);

        return monthArr;
    }

    const getHebEventsArr = useCallback(() => {
        const options = {
            year: selectedYear,
            month: selectedMonth + 1,
            isHebrewYear: false,
            candlelighting: false,
            location: Location.lookup('Tel Aviv'),
            sedrot: true,
            omer: true,
        };
        let events: Array<Event> = HebrewCalendar.calendar(options);
            
        return events;
    }, [selectedYear, selectedMonth]);

    const buildDateObj = useCallback((today: Date): Array<DayObj> => {
        const numberOfDays = getNumbersPerDay(today.getMonth(), today.getFullYear());
        const arr: Array<DayObj> = [];
        const hebrewEvents = getHebEventsArr();
        
        let currentDate = new Date();
        if (selectedDateArg) {
            currentDate = selectedDateArg;
        }
        currentDate.setHours(0,0,0,0);
                
        for (let i = 0; i < numberOfDays; i++) {
            const ButtonDate = new Date(today.getFullYear(), today.getMonth(), i + 1);
            const hebDate =  new HDate(ButtonDate);
            const el: DayObj = {
                internationalDate: i + 1,
                ButtonDate: ButtonDate,
                DayOfWeek: ButtonDate.getDay(),
                HebrewDate: hebDate,
                EventObj: hebrewEvents.filter(el => el.getDate().isSameDate(hebDate))
            }
            arr.push(el);
            if (currentDate.getTime() === ButtonDate.getTime()) {
                setSelectedDate(el);
            }
        }
        setFirstDayMonth(arr[0]);
        setLastDayMonth(arr[arr.length - 1]);
        // console.log('buildDateObj', arr);
        // console.log('getHebEventsArr', hebrewEvents);
        return arr;
    }, [getHebEventsArr, selectedDateArg]);

    const getNumbersPerDay = (monthIndex: number, year: number) => {
        monthIndex++;
        if (monthIndex === 1 || monthIndex === 3 || monthIndex === 5 || monthIndex === 7 ||  monthIndex === 8 ||  monthIndex === 10 ||  monthIndex === 12) {
            return 31;
        } else if (monthIndex === 4 || monthIndex === 6 || monthIndex === 9 || monthIndex === 11) {
            return 30;
        } else if (monthIndex === 2) {
            if (year % 4 === 0) {
                if (year % 400 === 0) {
                    return 29;
                } else if (year % 100 === 0) {
                    return 28;
                } else {
                    return 29;
                }
            } else {
                return 28;
            }
        } else {
            return 0;
        }
    }

    const setDatesNames = useCallback(() => {
        if (languageArg && languageArg === Language.Hebrew) {
            const weekday: Array<WeekdaysHebrew> = [];
            weekday.push(WeekdaysHebrew.Sunday);
            weekday.push(WeekdaysHebrew.Monday);
            weekday.push(WeekdaysHebrew.Tuesday);
            weekday.push(WeekdaysHebrew.Wednesday);
            weekday.push(WeekdaysHebrew.Thursday);
            weekday.push(WeekdaysHebrew.Friday);
            weekday.push(WeekdaysHebrew.Saturday);
            setSelectedEnum(weekday);
        } else {
            const weekday: Array<WeekdaysEnglish> = [];
            weekday.push(WeekdaysEnglish.Sunday);
            weekday.push(WeekdaysEnglish.Monday);
            weekday.push(WeekdaysEnglish.Tuesday);
            weekday.push(WeekdaysEnglish.Wednesday);
            weekday.push(WeekdaysEnglish.Thursday);
            weekday.push(WeekdaysEnglish.Friday);
            weekday.push(WeekdaysEnglish.Saturday);
            setSelectedEnum(weekday);
        }
    }, [languageArg]);

    const buildComponent = useCallback((dateObj: Date) => {
        setDatesNames();
        const res = buildMonthObj(buildDateObj(dateObj));
        setMonthDates(res);
    }, [buildDateObj, setDatesNames]);

    const handleKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>, obj: DayObj) => {
        if (evt.key === 'Enter') {
            console.log('handleKeyDown', evt, obj)
        }
    }

    const getHebMonthName = (hd: HDate | undefined): string => {
        if (hd) {
            switch (hd.getMonth()) {
                case 1:
                    return MonthsArr.NISAN;
                case 2:
                    return MonthsArr.IYYAR;
                case 3:
                    return MonthsArr.SIVAN;
                case 4:
                    return MonthsArr.TAMUZ;
                case 5:
                    return MonthsArr.AV;
                case 6:
                    return MonthsArr.ELUL;
                case 7:
                    return MonthsArr.TISHREI;
                case 8:
                    return MonthsArr.CHESHVAN;
                case 9:
                    return MonthsArr.KISLEV;
                case 10:
                    return MonthsArr.TEVET;
                case 11:
                    return MonthsArr.SHVAT;
                case 12:
                    return MonthsArr.ADAR_I;
                case 13:
                    return MonthsArr.ADAR_II;
                default:
                    return '';
            }
        }
        return '';
    }

    const handleSelectedYearChange = () => {
        let selectedYear = parseInt(selectedYearContainer.current?.value as string);
        if (isNaN(selectedYear)) {
            selectedYear = 1;
        }
        setSelectedYear(selectedYear);
    }

    const handleSelectedMonthChange = () => {
        setSelectedMonth(parseInt(selectedMonthContainer.current?.value as string));
    }

    useEffect(() => {
        const newDate = new Date(selectedYear, selectedMonth, 1);
        buildComponent(newDate);
        
    }, [selectedYear, selectedMonth, buildComponent]);

    //#endregion

    const handleClick = (obj: DayObj) => {
        setSelectedDate(obj);
        onSelectDateArg?.(obj);
    }

    return {selectedYear ,selectedMonth, SelectedEnum, MonthDates, FirstDayMonth, LastDayMonth, selectedDate, getHebMonthName, handleKeyDown, handleClick, selectedYearContainer, selectedMonthContainer, handleSelectedYearChange, handleSelectedMonthChange};
}

export { useCalendar };