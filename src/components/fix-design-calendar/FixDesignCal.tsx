import { Language } from "../../enums/language";
import type { DayObj } from "../../interfaces/dayObj";
import {gematriya} from '@hebcal/core';
import { Format } from "../../enums/format";
import { useCalendar } from "../../hooks/useCalendar";
import { Template } from "@krasnoff/react-shadow-dom-component";

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
    format?: Format
}

export function FixedDesignCal(props: CalProps) {
    const format = props.format ?? Format.LARGE;
    const language = props.language ?? Language.Hebrew;
    const {selectedYear ,selectedMonth, SelectedEnum, MonthDates, FirstDayMonth, LastDayMonth, selectedDate, getHebMonthName, handleKeyDown, handleClick, selectedYearContainer, selectedMonthContainer, handleSelectedYearChange, handleSelectedMonthChange} = useCalendar(props.selectedDate, props.language, props.onSelectDate);

    // Create a CSS stylesheet for the Shadow DOM
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(`
        :host {
            display: block;
            margin: 0 auto;
            max-width: ${format === Format.LARGE ? '614px' : '382px'};
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
            color: black;
            font-family: Arial, sans-serif;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            flex-direction: row-reverse;
        }
        .title {
            font-size: 1.0rem;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: bold;
        }
        .table {
            border-collapse: collapse;
            table-layout: fixed;
            margin-right: auto;
            margin-left: auto;
            min-width: 550px;
        }
        .table-small {
            min-width: 300px;
        }
        .table col {
            width: calc(100% / 7);
        }
        .table th {
            text-align: center;
            border: 1px solid #ddd;
        }
        .table td {
            border: 1px solid #ddd;
            font-size: 0.8rem;
            cursor: pointer;
        }
        .td-large {
            height: 70px;
        }
        .td-small {
            height: 40px;
        }
        .cell {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 95%;
            justify-content: space-between;
            padding: 0.2rem;
        }
        .div-dates {
            width: 100%;
            display: flex;
        }
        .div-large {
            justify-content: space-between;
        }
        .div-small {
            justify-content: space-between;
            height: 100%;
        }
        .div-small > .div-date-number {
            display: flex;
            align-items: flex-end;
        }
        .div-events {
            width: 100%;
        }
        .div-hebrew {
            direction: rtl;
        }
        .div-english {
            direction: ltr;
        }
    `);

    return (
        <Template shadowrootmode="open" sheet={stylesheet} shadowrootdelegatesfocus={true}>
            <div className="container">
                <div className="header">
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
                        aria-label="Year Input"
                        >
                        </input></div>
                    <div><select 
                                ref={selectedMonthContainer}
                                value={selectedMonth}
                                onChange={() => handleSelectedMonthChange()}
                                aria-label="Month Select">
                        <option value="0">January</option>
                        <option value="1">February</option>
                        <option value="2">March</option>
                        <option value="3">April</option>
                        <option value="4">May</option>
                        <option value="5">June</option>
                        <option value="6">July</option>
                        <option value="7">August</option>
                        <option value="8">September</option>
                        <option value="9">October</option>
                        <option value="10">November</option>
                        <option value="11">December</option>
                    </select></div>
                </div>
                <div className="title">
                    {FirstDayMonth?.HebrewDate ? <span>{getHebMonthName(FirstDayMonth?.HebrewDate)} {gematriya((FirstDayMonth as DayObj).HebrewDate.getFullYear())} -</span> : null}
                    {LastDayMonth?.HebrewDate ? <span>{getHebMonthName(LastDayMonth?.HebrewDate)} {gematriya((LastDayMonth as DayObj).HebrewDate.getFullYear())}</span> : null}
                </div>
                <table className={['table', format === Format.SMALL ? 'table-small' : ''].join(' ')}>
                    <colgroup>
                        <col span={7} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th aria-label="sunday">{SelectedEnum ? SelectedEnum[0] : ''}</th>
                            <th aria-label="monday">{SelectedEnum ? SelectedEnum[1] : ''}</th>
                            <th aria-label="tuesday">{SelectedEnum ? SelectedEnum[2] : ''}</th>
                            <th aria-label="wednesday">{SelectedEnum ? SelectedEnum[3] : ''}</th>
                            <th aria-label="thursday">{SelectedEnum ? SelectedEnum[4] : ''}</th>
                            <th aria-label="friday">{SelectedEnum ? SelectedEnum[5] : ''}</th>
                            <th aria-label="saturday">{SelectedEnum ? SelectedEnum[6] : ''}</th>
                        </tr>
                    </thead>
                    {MonthDates ? <tbody>
                        { MonthDates.map((el, index) => <tr key={index}>
                            {el.map((el, index) => <td className={[format === Format.LARGE ? 'td-large' : 'td-small'].join(' ')} style={el?.ButtonDate === selectedDate?.ButtonDate ? {backgroundColor: 'yellow'} : undefined} key={index} title={format === Format.SMALL ? el?.EventObj?.map((el2) => el2.render(props.language !== undefined ? props.language : Language.English)).join('\n') : undefined}>
                                {el ?
                                    <div className="cell" tabIndex={0} onKeyDown={(evt) => handleKeyDown(evt, el)} onClick={() => handleClick(el)}>
                                        <div className={['div-dates', format === Format.LARGE ? 'div-large' : 'div-small'].join(' ')}>
                                            <div>{gematriya(el.HebrewDate.getDate())}</div>
                                            <div className="div-date-number">{el?.ButtonDate.getDate()}</div>
                                        </div>
                                        {format !== Format.SMALL ? <div className={['div-events', language === Language.Hebrew ? 'div-hebrew' : 'div-english'].join(' ')}>{el?.EventObj?.map((el2, index) => <div key={index}>{el2.render(language)}</div>)}</div> : null}
                                    </div>
                                : null}
                            </td>)}
                        </tr>) }
                    </tbody> : null}
                </table>
            </div>
        </Template>
    );
}

