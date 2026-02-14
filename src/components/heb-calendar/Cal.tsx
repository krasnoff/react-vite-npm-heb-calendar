import { type CSSProperties } from "react";
import { Language } from "./HebrewCalendar/enums/language";
import type { DayObj } from "./HebrewCalendar/interfaces/dayObj";
import styles from './Cal.module.scss';
import {gematriya} from '@hebcal/core';
import { Format } from "./HebrewCalendar/enums/format";
import { useCalendar } from "../../hooks/useCalendar";

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
    const {selectedYear ,selectedMonth, SelectedEnum, MonthDates, FirstDayMonth, LastDayMonth, selectedDate, getHebMonthName, handleKeyDown, handleClick, selectedYearContainer, selectedMonthContainer, handleSelectedYearChange, handleSelectedMonthChange} = useCalendar(props.selectedDate, props.language, props.onSelectDate);

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

