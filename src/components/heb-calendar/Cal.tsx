import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Language } from "./HebrewCalendar/enums/language";
import { WeekdaysEnglish } from "./HebrewCalendar/enums/WeekDaysEnglish";
import { WeekdaysHebrew } from "./HebrewCalendar/enums/weekdaysHebrew";
import type { DayObj } from "./HebrewCalendar/interfaces/dayObj";
import type { WeekDateArray } from "./HebrewCalendar/types/WeekDateArray";
import styles from './Cal.module.scss';
import {gematriya, HDate, HebrewCalendar, Location, Event} from '@hebcal/core';
import { MonthsArr } from "./HebrewCalendar/enums/months";
import { Format } from "./HebrewCalendar/enums/format";

export interface CalProps {
    /**
     * Sets language of the component. either Hebrew or English
     */
    language?: Language,
    /**
     * Set a default date for the component
     */
    selectedDate?: Date,
    /**
     * Callback function when user chooses a day in the calendar
     * @param selectedDate A DayObj object that was chosen
     * @returns 
     */
    onSelectDate: (selectedDate: DayObj) => void,
    /**
     * general format of the component, large or small
     */
    format?: Format,
    /**
     * CSS of the whole component
     */
    customCalWrapper?: CSSProperties,
    /**
     * CSS of the top component
     */
    customControllers?: CSSProperties,
    /**
     * CSS of the input text which represents the year
     */
    customInputText?: CSSProperties,
    /**
     * CSS of the select month component
     */
    customSelect?: CSSProperties,
    /**
     * CSS of the select month options component
     */
    customSelectOption?: CSSProperties,
    /**
     * CSS of the custom hebrew title
     */
    customHebTitle?: CSSProperties,
    /**
     * CSS of the custom table
     */
    customTable?: CSSProperties,
    /**
     * CSS of the custom header row
     */
    customTr?: CSSProperties,
    /**
     * CSS of the custom data row
     */
    customDataTr?: CSSProperties,
    /**
     * CSS of the custom data cell
     */
    customTd?: CSSProperties,
    /**
     * CSS of the custom header cell
     */
    customTh?: CSSProperties,
    /**
     * CSS of the custom special event cell
     */
    customSpecialEvent?: CSSProperties,
    /**
     * CSS of the custom saturday cell
     */
    customSaturday?: CSSProperties,
    /**
     * CSS of the custom selected date cell
     */
    customSelectedDate?: CSSProperties,
    /**
     * CSS of the custom td inner content
     */
    customButtonDateWrapper?: CSSProperties,
    /**
     * CSS of the custom day in month component
     */
    customDate?: CSSProperties,
    /**
     * CSS of the custom hebrew day
     */
    customHebDate?: CSSProperties,
    /**
     * CSS of the custom gregorian day
     */
    customGregDate?: CSSProperties,
    /**
     * CSS of the custom description
     */
    customDesc?: CSSProperties,
}

export function Cal(props: CalProps) {
    const [SelectedEnum, setSelectedEnum] = useState<Array<WeekdaysHebrew | WeekdaysEnglish>>()
    const [MonthDates, setMonthDates] = useState<Array<WeekDateArray>>([]);
    const [FirstDayMonth, setFirstDayMonth] = useState<DayObj>();
    const [LastDayMonth, setLastDayMonth] = useState<DayObj>();
    const [selectedYear, setSelectedYear] = useState<number>(props.selectedDate ? props.selectedDate.getFullYear() : (new Date()).getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(props.selectedDate ? props.selectedDate.getMonth() : (new Date()).getMonth());
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
        if (props.selectedDate) {
            currentDate = props.selectedDate;
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
    }, [getHebEventsArr, props.selectedDate]);

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
        if (props.language && props.language === Language.Hebrew) {
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
    }, [props.language]);

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
        props.onSelectDate(obj);
    }

    return (
        <div className={[
                styles.calWrapper, 
                props.language === Language.English ? styles.calWrapperEng : null,
                props.format === Format.SMALL ? styles.calWrapperSmall : null
            ].join(' ')} style={props.customCalWrapper}>
            <div className={styles.controllers} style={props.customControllers}>
                <div><input 
                    type="text" 
                    maxLength={4}
                    onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    value={selectedYear}
                    onChange={() => handleSelectedYearChange()}
                    ref={selectedYearContainer}
                    style={props.customInputText}
                    aria-label="Year Input"
                    >
                    </input></div>
                <div><select 
                            ref={selectedMonthContainer}
                            value={selectedMonth}
                            onChange={() => handleSelectedMonthChange()}
                            style={props.customSelect}
                            aria-label="Month Select">
                    <option value="0" style={props.customSelectOption}>January</option>
                    <option value="1" style={props.customSelectOption}>February</option>
                    <option value="2" style={props.customSelectOption}>March</option>
                    <option value="3" style={props.customSelectOption}>April</option>
                    <option value="4" style={props.customSelectOption}>May</option>
                    <option value="5" style={props.customSelectOption}>June</option>
                    <option value="6" style={props.customSelectOption}>July</option>
                    <option value="7" style={props.customSelectOption}>August</option>
                    <option value="8" style={props.customSelectOption}>September</option>
                    <option value="9" style={props.customSelectOption}>October</option>
                    <option value="10" style={props.customSelectOption}>November</option>
                    <option value="11" style={props.customSelectOption}>December</option>
                </select></div>
            </div>
            <div className={styles.hebTitle} style={props.customHebTitle}>
                {FirstDayMonth?.HebrewDate ? <span>{getHebMonthName(FirstDayMonth?.HebrewDate)} {gematriya((FirstDayMonth as DayObj).HebrewDate.getFullYear())} -</span> : null}
                {LastDayMonth?.HebrewDate ? <span>{getHebMonthName(LastDayMonth?.HebrewDate)} {gematriya((LastDayMonth as DayObj).HebrewDate.getFullYear())}</span> : null}
            </div>
            <table style={props.customTable}>
                <colgroup>
                    <col span={7} />
                </colgroup>
                <thead>
                    <tr style={props.customTr}>
                        <th style={props.customTh}>{SelectedEnum ? SelectedEnum[0] : ''}</th>
                        <th style={props.customTh}>{SelectedEnum ? SelectedEnum[1] : ''}</th>
                        <th style={props.customTh}>{SelectedEnum ? SelectedEnum[2] : ''}</th>
                        <th style={props.customTh}>{SelectedEnum ? SelectedEnum[3] : ''}</th>
                        <th style={props.customTh}>{SelectedEnum ? SelectedEnum[4] : ''}</th>
                        <th style={props.customTh}>{SelectedEnum ? SelectedEnum[5] : ''}</th>
                        <th style={props.customTh}>{SelectedEnum ? SelectedEnum[6] : ''}</th>
                    </tr>
                </thead>
                {MonthDates ? <tbody>
                    { MonthDates.map((el, index) => <tr key={index} className={styles.dataTR} style={props.customDataTr}>
                        {el.map((el, index) => <td key={index} className={[
                                el?.ButtonDate === selectedDate?.ButtonDate ? styles.selectedDate : undefined,
                                el?.EventObj?.length && el?.EventObj?.length > 0 ? styles.specialEvent : undefined,
                                el?.DayOfWeek === 6 ? styles.saturday : undefined,
                            ].join(' ')} style={{
                                ...props.customTd, 
                                ...(el?.EventObj?.length && el?.EventObj?.length > 0 ? props.customSpecialEvent : null), 
                                ...(el?.DayOfWeek === 6 ? props.customSaturday : null), 
                                ...(el?.ButtonDate === selectedDate?.ButtonDate ? props.customSelectedDate : null)
                            }}>
                            {el ?
                                <div tabIndex={0} onKeyDown={(evt) => handleKeyDown(evt, el)} onClick={() => handleClick(el)} className={styles.buttonDateWrapper} style={props.customButtonDateWrapper}>
                                    <div className={styles.date} style={props.customDate}>
                                        <div className={styles.hebDate} style={props.customHebDate}>{gematriya(el.HebrewDate.getDate())}</div>
                                        <div className={styles.gregDate} style={props.customGregDate}>{el?.ButtonDate.getDate()}</div>
                                    </div>
                                    {props.format !== Format.SMALL ? <div className={[styles.desc, props.language === Language.English ? styles.descEng : null].join(' ')} style={props.customDesc}>{el?.EventObj?.map((el2, index) => <div key={index}>{el2.render(props.language !== undefined ? props.language : Language.English)}</div>)}</div> : null}
                                </div>
                            : null}
                        </td>)}
                    </tr>) }
                </tbody> : null}
            </table>
        </div>
    );
}

