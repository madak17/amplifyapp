import { useState, useEffect } from "react";
import moment from "moment";
import '../assets/css/WorldClock.css';

/**
 * Fetches weather data based on symbols selected and passes them to the Stock component to be displayed.
 */
function WorldClock() {
    const [date, setDate] = useState(moment());

    /**
     * Sets a timer that ends after 1000 ticks. Calls tick function to update the current date/time.
     */    
    useEffect(() => {
        let timerID = setInterval( () => tick(), 1000 );
   
        return function cleanup() {
            clearInterval(timerID);
        };
    });

    /**
     * Sets the date variable to the moment when the function is called.
     */   
    function tick() {
        setDate(moment());
    }

    return (
        <div id="WorldClock">
            <h2>World Clock</h2>
            <table id="WorldClockTable">
                <thead>
                    <tr>
                        <th scope="col">
                            City
                        </th>
                        <th scope="col">
                            Country
                        </th>
                        <th scope="col">
                            Date
                        </th>
                        <th scope="col">
                            Local Time
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            Vienna
                        </td>
                        <td>
                            AT
                        </td>
                        <td>
                            {date.tz("Europe/Vienna").format('ddd, MMM Do')}
                        </td>
                        <td>
                            {date.tz("Europe/Vienna").format('HH:mm:ss')}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Vancouver
                        </td>
                        <td>
                            CA
                        </td>
                        <td>
                            {date.tz("America/Vancouver").format('ddd, MMM Do')}
                        </td>
                        <td>
                            {date.tz("America/Vancouver").format('HH:mm:ss')}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Beijing
                        </td>
                        <td>
                            CN
                        </td>
                        <td>
                            {date.tz("Asia/Shanghai").format('ddd, MMM Do')}
                        </td>
                        <td>
                            {date.tz("Asia/Shanghai").format('HH:mm:ss')}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Berlin
                        </td>
                        <td>
                            DE
                        </td>
                        <td>
                            {date.tz("Europe/Berlin").format('ddd, MMM Do')}
                        </td>
                        <td>
                            {date.tz("Europe/Berlin").format('HH:mm:ss')}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Copenhagen
                        </td>
                        <td>
                            DK
                        </td>
                        <td>
                            {date.tz("Europe/Copenhagen").format('ddd, MMM Do')}
                        </td>
                        <td>
                            {date.tz("Europe/Copenhagen").format('HH:mm:ss')}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Madison
                        </td>
                        <td>
                            US
                        </td>
                        <td>
                            {date.tz("America/Chicago").format('ddd, MMM Do')}
                        </td>
                        <td>
                            {date.tz("America/Chicago").format('HH:mm:ss')}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Raleigh
                        </td>
                        <td>
                            US
                        </td>
                        <td>
                            {date.tz("America/New_York").format('ddd, MMM Do')}
                        </td>
                        <td>
                            {date.tz("America/New_York").format('HH:mm:ss')}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default WorldClock;