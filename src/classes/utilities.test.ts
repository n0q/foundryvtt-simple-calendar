/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";
import "../../__mocks__/dialog";
import "../../__mocks__/hooks";
import "../../__mocks__/crypto";

import Utilities from "./utilities";
import {SCDateSelector} from "../interfaces";
import {MoonIcons} from "../constants";

describe('Utilities Class Tests', () => {

    test('Generate Unique Id', () => {
        expect(Utilities.generateUniqueId()).toBeDefined();
    });

    test('Random Hash', () => {
        expect(Utilities.randomHash('')).toBe(0);
        expect(Utilities.randomHash('asd')).not.toBe(0);
    });

    test('Ordinal Suffix', () => {
        const orig = (<Game>game).i18n.localize;
        (<Game>game).i18n.localize = jest.fn((a: string) => {
            switch (a){
                case 'FSC.OrdinalSuffix.st':
                    return 'st';
                case 'FSC.OrdinalSuffix.nd':
                    return 'nd';
                case 'FSC.OrdinalSuffix.rd':
                    return 'rd';
                default:
                    return 'th';
            }
        })

        expect(Utilities.ordinalSuffix(0)).toBe('th');
        expect(Utilities.ordinalSuffix(1)).toBe('st');
        expect(Utilities.ordinalSuffix(2)).toBe('nd');
        expect(Utilities.ordinalSuffix(3)).toBe('rd');
        expect(Utilities.ordinalSuffix(4)).toBe('th');
        expect(Utilities.ordinalSuffix(5)).toBe('th');
        expect(Utilities.ordinalSuffix(6)).toBe('th');
        expect(Utilities.ordinalSuffix(7)).toBe('th');
        expect(Utilities.ordinalSuffix(8)).toBe('th');
        expect(Utilities.ordinalSuffix(9)).toBe('th');
        expect(Utilities.ordinalSuffix(10)).toBe('th');
        expect(Utilities.ordinalSuffix(11)).toBe('th');
        expect(Utilities.ordinalSuffix(12)).toBe('th');
        expect(Utilities.ordinalSuffix(13)).toBe('th');
        expect(Utilities.ordinalSuffix(14)).toBe('th');
        expect(Utilities.ordinalSuffix(21)).toBe('st');
        expect(Utilities.ordinalSuffix(22)).toBe('nd');
        expect(Utilities.ordinalSuffix(23)).toBe('rd');
        expect(Utilities.ordinalSuffix(111)).toBe('th');
        expect(Utilities.ordinalSuffix(112)).toBe('th');
        expect(Utilities.ordinalSuffix(113)).toBe('th');

        (<Game>game).i18n.localize = orig;
    });

    test('Get Contrast Color', () => {
        expect(Utilities.GetContrastColor('#ffffff')).toBe('#000000');
        expect(Utilities.GetContrastColor('#000000')).toBe('#FFFFFF');
        expect(Utilities.GetContrastColor('#000')).toBe('#FFFFFF');
        expect(Utilities.GetContrastColor('ffffff')).toBe('#000000');
        expect(Utilities.GetContrastColor('fffff')).toBe('#000000');
    });

    test('Format Time', () => {
        const dateToCheck: SCDateSelector.Date = {
            year: 1,
            month: 1,
            day: 10,
            allDay: true,
            hour: 0,
            minute: 0
        };
        expect(Utilities.FormatTime(dateToCheck.hour, dateToCheck.minute, false)).toBe('00:00');
        dateToCheck.hour = 10;
        dateToCheck.minute = 15;
        expect(Utilities.FormatTime(dateToCheck.hour, dateToCheck.minute, false)).toBe('10:15');
        expect(Utilities.FormatTime(dateToCheck.hour, dateToCheck.minute, 0)).toBe('10:15:00');
        expect(Utilities.FormatTime(dateToCheck.hour, dateToCheck.minute, 12)).toBe('10:15:12');
    });

    test('Get Moon Phase Icon', () => {
        //@ts-ignore
        expect(Utilities.GetMoonPhaseIcon()).toBe('');
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.FirstQuarter, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.Full, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.LastQuarter, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.NewMoon, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.WaningCrescent, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.WaningGibbous, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.WaxingCrescent, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.WaxingGibbous, '#ffffff')).toBeDefined();
    });
});