/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/game";
import "../../../__mocks__/form-application";
import "../../../__mocks__/application";
import "../../../__mocks__/handlebars";
import "../../../__mocks__/event";
import "../../../__mocks__/crypto";
import "../../../__mocks__/dialog";
import "../../../__mocks__/hooks";
import Calendar from "../calendar";
import {
    AdvanceTimeToPreset,
    DateTheSame, DateToTimestamp,
    DaysBetweenDates,
    FormatDateTime,
    GetDisplayDate,
    IsDayBetweenDates,
    TimestampToDate,
    ToSeconds
} from "./date-time";
import PredefinedCalendar from "../configuration/predefined-calendar";
import {DateRangeMatch, GameSystems, PredefinedCalendars, PresetTimeOfDay} from "../../constants";
import fetchMock from 'jest-fetch-mock'
import {GameSettings} from "../foundry-interfacing/game-settings";
import {CalManager, updateCalManager, updateSC} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import {Logger} from "../logging";
import {SimpleCalendar} from "../../../types";
import SCController from "../s-c-controller";

fetchMock.enableMocks();
describe('Utilities Date/Time Tests', () => {

    let tCal: Calendar;

    beforeEach(async () => {
        fetchMock.resetMocks();
        fetchMock.mockOnce(`{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":127},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`)
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        tCal = new Calendar('test', '');
        jest.spyOn(CalManager, 'getActiveCalendar').mockReturnValue(tCal);
        jest.spyOn(CalManager, 'getCalendar').mockReturnValue(tCal);
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);
    })

    test('FormatDateTime', async () => {
        jest.spyOn(GameSettings, 'Localize').mockImplementation(()=>{return '';});

        //Year
        expect(FormatDateTime({year: 2021, month: 11, day: 24, hour: 11, minute: 22, seconds: 33}, "YY YYYY YN YA YZ", tCal)).toBe('21 2021   ');
        expect(FormatDateTime({year: 2021, month: 11, day: 24, hour: 11, minute: 22, seconds: 33}, "YY YYYY YN YA YZ", tCal, {year: true})).toBe('<input type="number" style="width:4ch;" value="21" /> <input type="number" style="width:6ch;" value="2021" />   ');
        //Month
        expect(FormatDateTime({year: 2021, month: 11, day: 24, hour: 11, minute: 22, seconds: 33}, "M MM MMM MMMM", tCal)).toBe('12 12 Dec December');
        //Day
        expect(FormatDateTime({year: 2021, month: 11, day: 24, hour: 11, minute: 22, seconds: 33}, "D DD DO", tCal)).toBe('25 25 25');
        //Weekday
        expect(FormatDateTime({year: 2021, month: 11, day: 24, hour: 11, minute: 22, seconds: 33}, "d dd ddd dddd", tCal)).toBe('7 07 Sa Saturday');
        //Hour
        expect(FormatDateTime({year: 2021, month: 11, day: 24, hour: 11, minute: 22, seconds: 33}, "h H hh HH a A", tCal)).toBe('11 11 11 11 am AM');
        expect(FormatDateTime({year: 2021, month: 11, day: 24, hour: 13, minute: 22, seconds: 33}, "h H hh HH a A", tCal)).toBe('1 13 01 13 pm PM');
        expect(FormatDateTime({year: 2021, month: 11, day: 24, hour: 24, minute: 22, seconds: 33}, "h H hh HH a A", tCal)).toBe('12 24 12 24 pm PM');
        //Minute
        expect(FormatDateTime({year: 2021, month: 11, day: 24, hour: 11, minute: 22, seconds: 33}, "m mm", tCal)).toBe('22 22');
        //Second
        expect(FormatDateTime({year: 2021, month: 11, day: 24, hour: 11, minute: 22, seconds: 33}, "s ss", tCal)).toBe('33 33');
        //Text
        expect(FormatDateTime({year: 2021, month: 11, day: 24, hour: 11, minute: 22, seconds: 33}, "[Text]", tCal)).toBe('Text');

        //Error
        jest.spyOn(Logger,'error').mockImplementation(() => {});
        expect(FormatDateTime({year: 2021, month: 12, day: 24, hour: 11, minute: 22, seconds: 33}, "M MM MMM MMMM", tCal)).toBe('');
        expect(Logger.error).toHaveBeenCalled();
    });

    test('To Seconds', async () => {
        expect(ToSeconds(tCal,1970, 0, 0, false)).toBe(0);

        tCal.gameSystem = GameSystems.PF2E;
        //@ts-ignore
        game.pf2e = {worldClock:{dateTheme: "AA", worldCreatedOn: 0}};
        expect(ToSeconds(tCal,1970, 0, 0, false)).toBe(86400);

        //@ts-ignore
        game.pf2e = {worldClock:{dateTheme: "AR", worldCreatedOn: 0}};
        expect(ToSeconds(tCal,4670, 0, 0, false)).toBe(86400);
        //@ts-ignore
        game.pf2e = {worldClock:{dateTheme: "AD", worldCreatedOn: 0}};
        expect(ToSeconds(tCal,1875, 0, 0)).toBe(86527);

    });

    test('Get Display Date', async () => {
        const startDate: SimpleCalendar.DateTime = {
            year: 1,
            month: 1,
            day: 10,
            hour: 0,
            minute: 0,
            seconds: 0
        };
        const endDate: SimpleCalendar.DateTime  = {
            year: 1,
            month: 1,
            day: 10,
            hour: 0,
            minute: 0,
            seconds: 0
        };

        expect(GetDisplayDate(tCal, startDate, endDate, true)).toBe('February 11, 1');
        expect(GetDisplayDate(tCal, startDate, endDate, true, true)).toBe('');
        expect(GetDisplayDate(tCal, startDate, endDate, true, false, false)).toBe('February 11');

        endDate.day = 11;
        endDate.minute = 1;
        expect(GetDisplayDate(tCal, startDate, endDate, true, true)).toBe('February 11, 1 - February 12, 1');

        expect(GetDisplayDate(tCal, startDate, endDate, false, true)).toBe('February 11, 1 00:00 - February 12, 1 00:01');
    });

    test('Date The Same', () => {
        expect(DateTheSame({year: 1, month: 2, day: 3, hour: 4, minute: 5, seconds: 0}, {year: 1, month: 2, day: 3, hour: 4, minute: 5, seconds: 0})).toBe(true);
        expect(DateTheSame({year: 1, month: 2, day: 3, hour: 4, minute: 5, seconds: 0}, {year: 1, month: 2, day: 3, hour: 5, minute: 5, seconds: 0})).toBe(true);
        expect(DateTheSame({year: 1, month: 2, day: 3, hour: 4, minute: 5, seconds: 0}, {year: 1, month: 2, day: 3, hour: 4, minute: 6, seconds: 0})).toBe(true);
        expect(DateTheSame({year: 1, month: 2, day: 3, hour: 4, minute: 5, seconds: 0}, {year: 1, month: 2, day: 3, hour: 4, minute: 5, seconds: 0})).toBe(true);
        expect(DateTheSame({year: 1, month: 2, day: 3, hour: 4, minute: 5, seconds: 0}, {year: 1, month: 2, day: 4, hour: 4, minute: 5, seconds: 0})).toBe(false);
        expect(DateTheSame({year: 1, month: 2, day: 3, hour: 4, minute: 5, seconds: 0}, {year: 1, month: 3, day: 3, hour: 4, minute: 5, seconds: 0})).toBe(false);
        expect(DateTheSame({year: 1, month: 2, day: 3, hour: 4, minute: 5, seconds: 0}, {year: 2, month: 2, day: 3, hour: 4, minute: 5, seconds: 0})).toBe(false);
    });

    test('Days Between Dates', () => {
        const startDate: SimpleCalendar.DateTime = {
            year: 1,
            month: 1,
            day: 10,
            hour: 0,
            minute: 0,
            seconds: 0
        };
        const endDate: SimpleCalendar.DateTime = {
            year: 1,
            month: 1,
            day: 10,
            hour: 0,
            minute: 0,
            seconds: 0
        };

        expect(DaysBetweenDates(tCal, startDate, endDate)).toBe(0);

        endDate.day = 11;
        expect(DaysBetweenDates(tCal, startDate, endDate)).toBe(1);

        endDate.day = 12;
        expect(DaysBetweenDates(tCal, startDate, endDate)).toBe(2);
    });

    test('Is Day Between Dates', () => {
        const dateToCheck: SimpleCalendar.DateTime = {
            year: 1,
            month: 1,
            day: 10,
            hour: 0,
            minute: 0,
            seconds: 0
        };
        const startDate: SimpleCalendar.DateTime = {
            year: 1,
            month: 1,
            day: 10,
            hour: 0,
            minute: 0,
            seconds: 0
        };
        const endDate: SimpleCalendar.DateTime = {
            year: 1,
            month: 1,
            day: 10,
            hour: 0,
            minute: 0,
            seconds: 0
        };

        expect(IsDayBetweenDates(tCal, dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Exact);

        endDate.day = 11;
        expect(IsDayBetweenDates(tCal, dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Start);

        startDate.day = 9;
        endDate.day = 10;
        expect(IsDayBetweenDates(tCal, dateToCheck, startDate, endDate)).toBe(DateRangeMatch.End);

        endDate.day = 11;
        expect(IsDayBetweenDates(tCal, dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        endDate.day = 9;
        expect(IsDayBetweenDates(tCal, dateToCheck, startDate, endDate)).toBe(DateRangeMatch.None);

        endDate.month = 3;
        endDate.day = 11;
        expect(IsDayBetweenDates(tCal, dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        dateToCheck.month = 3;
        expect(IsDayBetweenDates(tCal, dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        dateToCheck.month = 2;
        expect(IsDayBetweenDates(tCal, dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        endDate.year = 3;
        dateToCheck.month = 3;
        dateToCheck.year = 2;
        expect(IsDayBetweenDates(tCal, dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        endDate.year = 1;
        expect(IsDayBetweenDates(tCal, dateToCheck, startDate, endDate)).toBe(DateRangeMatch.None);

        endDate.year = 3;
        endDate.month = 1;
        expect(IsDayBetweenDates(tCal, dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);
    });

    test('Timestamp to Date', async () => {
        let tstd = TimestampToDate(3600, tCal);
        expect(tstd.year).toBe(1970);
        expect(tstd.month).toBe(0);
        expect(tstd.day).toBe(0);
        expect(tstd.hour).toBe(1);
        expect(tstd.minute).toBe(0);
        expect(tstd.second).toBe(0);
        expect(TimestampToDate(3600, tCal)).toEqual({"currentSeason":{"color":"#479dff","icon":"winter","id":expect.any(String),"name":"Winter","numericRepresentation":NaN,"startingDay":20,"startingMonth":11,"sunriseTime":21600,"sunsetTime":64800},"day":0,"dayOfTheWeek":4,"dayOffset":0,"display":{"date":"January 01, 1970","day":"1","month":"1","monthName":"January","time":"01:00:00","weekday":"Thursday","year":"1970","yearName":"","yearPostfix":"","yearPrefix":""},"hour":1,"isLeapYear":false,"midday":1641038400,"minute":0,"month":0,"second":0,"showWeekdayHeadings":true,"sunrise":1641016800,"sunset":1641060000,"weekdays":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"year":1970,"yearZero":1970});
        expect(TimestampToDate(5184000, tCal)).toEqual({"currentSeason":{"color":"#479dff","icon":"winter","id":expect.any(String),"name":"Winter","numericRepresentation":NaN,"startingDay":20,"startingMonth":11,"sunriseTime":21600,"sunsetTime":64800},"day":1,"dayOfTheWeek":1,"dayOffset":0,"display":{"date":"March 02, 1970","day":"2","month":"3","monthName":"March","time":"00:00:00","weekday":"Monday","year":"1970","yearName":"","yearPostfix":"","yearPrefix":""},"hour":0,"isLeapYear":false,"midday":1646222400,"minute":0,"month":2,"second":0,"showWeekdayHeadings":true,"sunrise":1646200800,"sunset":1646244000,"weekdays":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"year":1970,"yearZero":1970});
        expect(TimestampToDate(5270400, tCal)).toEqual({"currentSeason":{"color":"#479dff","icon":"winter","id":expect.any(String),"name":"Winter","numericRepresentation":NaN,"startingDay":20,"startingMonth":11,"sunriseTime":21600,"sunsetTime":64800},"day":2,"dayOfTheWeek":2,"dayOffset":0,"display":{"date":"March 03, 1970","day":"3","month":"3","monthName":"March","time":"00:00:00","weekday":"Tuesday","year":"1970","yearName":"","yearPostfix":"","yearPrefix":""},"hour":0,"isLeapYear":false,"midday":1646308800,"minute":0,"month":2,"second":0,"showWeekdayHeadings":true,"sunrise":1646287200,"sunset":1646330400,"weekdays":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"year":1970,"yearZero":1970});

        tCal.gameSystem = GameSystems.PF2E;
        tCal.generalSettings.pf2eSync = true;
        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AR", worldCreatedOn: 0}};
        fetchMock.mockOnce(`{"calendar":{"currentDate":{"year":4710,"month":0,"day":0,"seconds":127},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"id":"f4a54f97","rule":"custom","customMod":4},"months":[{"name":"Abadius","abbreviation":"Aba","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Calistril","abbreviation":"Cal","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Pharast","abbreviation":"Pha","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Gozran","abbreviation":"Goz","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Desnus","abbreviation":"Des","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Sarenith","abbreviation":"Sar","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Erastus","abbreviation":"Era","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Arodus","abbreviation":"Aro","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Rova","abbreviation":"Rov","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Lamashan","abbreviation":"Lam","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Neth","abbreviation":"Net","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Kuthona","abbreviation":"Kut","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Somal","cycleLength":29.5,"firstNewMoon":{"yearReset":"x-years","yearX":4,"year":4700,"month":1,"day":7},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.375,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.375,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.375,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.375,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":0,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":0,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":0,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":0,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Mo","name":"Moonday","numericRepresentation":1},{"abbreviation":"To","name":"Toilday","numericRepresentation":2},{"abbreviation":"We","name":"Wealday","numericRepresentation":3},{"abbreviation":"Oa","name":"Oathday","numericRepresentation":4},{"abbreviation":"Fi","name":"Fireday","numericRepresentation":5},{"abbreviation":"St","name":"Starday","numericRepresentation":6},{"abbreviation":"Su","name":"Sunday","numericRepresentation":7}],"year":{"numericRepresentation":4710,"prefix":"","postfix":" AR","showWeekdayHeadings":true,"firstWeekday":6,"yearZero":2700,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`)
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.GolarianPF2E);

        expect(TimestampToDate(3600, tCal)).toEqual({"currentSeason":{"color":"#479dff","icon":"winter","id":expect.any(String),"name":"Winter","numericRepresentation":NaN,"startingDay":0,"startingMonth":11,"sunriseTime":21600,"sunsetTime":64800},"day":30,"dayOfTheWeek":2,"dayOffset":0,"display":{"date":"Kuthona 31, 4669","day":"31","month":"12","monthName":"Kuthona","time":"01:00:00","weekday":"Wealday","year":"4669","yearName":"","yearPostfix":" AR","yearPrefix":""},"hour":1,"isLeapYear":false,"midday":1293796800,"minute":0,"month":11,"second":0,"showWeekdayHeadings":true,"sunrise":1293775200,"sunset":1293818400,"weekdays":["Moonday","Toilday","Wealday","Oathday","Fireday","Starday","Sunday"],"year":4669,"yearZero":2700});
        expect(TimestampToDate(5184000, tCal)).toEqual({"currentSeason":{"color":"#46b946","icon":"spring","id":expect.any(String),"name":"Spring","numericRepresentation":NaN,"startingDay":0,"startingMonth":2,"sunriseTime":21600,"sunsetTime":64800},"day":0,"dayOfTheWeek":6,"dayOffset":0,"display":{"date":"Pharast 01, 4670","day":"1","month":"3","monthName":"Pharast","time":"00:00:00","weekday":"Sunday","year":"4670","yearName":"","yearPostfix":" AR","yearPrefix":""},"hour":0,"isLeapYear":false,"midday":1267444800,"minute":0,"month":2,"second":0,"showWeekdayHeadings":true,"sunrise":1267423200,"sunset":1267466400,"weekdays":["Moonday","Toilday","Wealday","Oathday","Fireday","Starday","Sunday"],"year":4670,"yearZero":2700});
        expect(TimestampToDate(5270400, tCal)).toEqual({"currentSeason":{"color":"#46b946","icon":"spring","id":expect.any(String),"name":"Spring","numericRepresentation":NaN,"startingDay":0,"startingMonth":2,"sunriseTime":21600,"sunsetTime":64800},"day":1,"dayOfTheWeek":0,"dayOffset":0,"display":{"date":"Pharast 02, 4670","day":"2","month":"3","monthName":"Pharast","time":"00:00:00","weekday":"Moonday","year":"4670","yearName":"","yearPostfix":" AR","yearPrefix":""},"hour":0,"isLeapYear":false,"midday":1267531200,"minute":0,"month":2,"second":0,"showWeekdayHeadings":true,"sunrise":1267509600,"sunset":1267552800,"weekdays":["Moonday","Toilday","Wealday","Oathday","Fireday","Starday","Sunday"],"year":4670,"yearZero":2700});
    });

    test('Date to Timestamp', () => {
        expect(DateToTimestamp({}, tCal)).toBe(tCal.toSeconds());
        expect(DateToTimestamp({year: 2021, month: 4, day: 9, hour: 15, minute: 54, seconds: 29}, tCal)).toBe(1652198069);

        tCal.months.forEach(m => m.resetDays('current'));
        expect(DateToTimestamp({year: 2021, hour: 15, minute: 54, seconds: 29}, tCal)).toBe(1646150069);
        tCal.resetMonths();
        expect(DateToTimestamp({year: 2021, hour: 15, minute: 54, seconds: 29}, tCal)).toBe(1641052469);
    });

    test('Advance Time to Preset', async () => {
        //@ts-ignore
        game.user.isGM = true;
        jest.spyOn(CalManager, 'saveCalendars').mockImplementation(async () => {});
        await AdvanceTimeToPreset(PresetTimeOfDay.Midday, tCal.id);
        expect(tCal.time.seconds).toBe(43200);

        let currentMD = tCal.getMonthAndDayIndex();
        await AdvanceTimeToPreset(PresetTimeOfDay.Midnight, tCal.id);
        expect(tCal.time.seconds).toBe(0);
        expect(tCal.getMonthAndDayIndex()).not.toEqual(currentMD);

        await AdvanceTimeToPreset(PresetTimeOfDay.Sunrise, tCal.id);
        expect(tCal.time.seconds).toBe(21600);

        await AdvanceTimeToPreset(PresetTimeOfDay.Sunset, tCal.id);
        expect(tCal.time.seconds).toBe(64800);

        currentMD = tCal.getMonthAndDayIndex();
        await AdvanceTimeToPreset(PresetTimeOfDay.Sunrise, tCal.id);
        expect(tCal.time.seconds).toBe(21600);
        expect(tCal.getMonthAndDayIndex()).not.toEqual(currentMD);


        tCal.seasons[0].sunriseTime = 10000;
        tCal.seasons[1].sunriseTime = 20000;
        tCal.seasons[2].sunriseTime = 30000;
        tCal.seasons[3].sunriseTime = 40000;
        await AdvanceTimeToPreset(PresetTimeOfDay.Sunrise, tCal.id);
        expect(tCal.time.seconds).toBeGreaterThan(10000);

        tCal.resetMonths();
        await AdvanceTimeToPreset(PresetTimeOfDay.Sunrise, tCal.id);
        expect(tCal.time.seconds).toBeGreaterThan(10000);


        //@ts-ignore
        game.user.isGM = false;


        /*MainApp.instance.activeCalendar.year = year;
        year.seasons.push(new Season('Spring', 3, 20));
        year.seasons[0].sunriseTime = 21600;
        year.seasons[0].sunsetTime = 64800;

        API.advanceTimeToPreset(PresetTimeOfDay.Midday);
        expect(year.time.seconds).toBe(0);

        //@ts-ignore
        game.user.isGM = true;
        API.advanceTimeToPreset(PresetTimeOfDay.Midday);
        expect(year.time.seconds).toBe(43200);
        expect(year.months[0].current).toBe(true);
        expect(year.months[0].days[0].current).toBe(true);

        API.advanceTimeToPreset(PresetTimeOfDay.Sunrise);
        expect(year.time.seconds).toBe(21600);
        expect(year.months[0].current).toBe(true);
        expect(year.months[0].days[1].current).toBe(true);

        API.advanceTimeToPreset(PresetTimeOfDay.Sunset);
        expect(year.time.seconds).toBe(64800);
        expect(year.months[0].current).toBe(true);
        expect(year.months[0].days[1].current).toBe(true);

        API.advanceTimeToPreset(PresetTimeOfDay.Midday);
        expect(year.time.seconds).toBe(43200);
        expect(year.months[0].current).toBe(true);
        expect(year.months[0].days[2].current).toBe(true);

        API.advanceTimeToPreset(PresetTimeOfDay.Midnight);
        expect(year.time.seconds).toBe(0);
        expect(year.months[0].current).toBe(true);
        expect(year.months[0].days[3].current).toBe(true);

        year.time.seconds = 21600;
        year.months[0].resetDays();
        year.months[0].days[29].current = true;
        year.months[1].days = [];
        API.advanceTimeToPreset(PresetTimeOfDay.Sunrise);
        expect(year.time.seconds).toBe(21600);
        expect(year.months[1].current).toBe(true);

        year.months[0].current = true;
        year.months[0].days = [];
        API.advanceTimeToPreset(PresetTimeOfDay.Sunrise);
        expect(year.time.seconds).toBe(0);

        year.months = [];
        API.advanceTimeToPreset(PresetTimeOfDay.Sunrise);
        expect(year.time.seconds).toBe(0);

        //@ts-ignore
        API.advanceTimeToPreset('asd');
        expect(year.time.seconds).toBe(0);


        //@ts-ignore
        game.user.isGM = false;*/
    });
});