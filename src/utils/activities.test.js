import {calculateStreak} from "./activities";

const ONE_DAY = 24 * 60 * 60 * 1000;
const TWO_DAYS = 2 * ONE_DAY;
const FOUR_DAYS = 4 * ONE_DAY;

const ONE_HOUR = 60 * 60 * 1000;


describe('calculateStreak', () => {
    const today = Date.now();

    it('should return 0 if no activities', () => {
        expect(calculateStreak([])).toBe(0);
    });

    it('should return 0 if no consequent activities', () => {
        const activities = [
            {
                name: "2 days ago activity",
                start: today - TWO_DAYS,
                end: today - TWO_DAYS - ONE_HOUR
            },
        ];

        expect(calculateStreak(activities)).toBe(0);
    });

    it('should return 1 if no activities yesterday but there is an activity today', () => {
        const activities = [
            {
                name: "2 days ago activity",
                start: today - TWO_DAYS,
                end: today - TWO_DAYS - ONE_HOUR
            },
            {
                name: "today",
                start: today,
                end: today - ONE_HOUR
            },
        ];

        expect(calculateStreak(activities)).toBe(1);
    });

    it('should return 1 if one activity yesterday', () => {
        const activities = [
            {start: today - ONE_DAY, end: today - ONE_DAY - ONE_HOUR},
        ];

        expect(calculateStreak(activities)).toBe(1);
    });

    it('should return 2 if one activity yesterday', () => {
        const activities = [
            {start: today - ONE_DAY, end: today - ONE_DAY - ONE_HOUR},
            {start: today, end: today - ONE_HOUR},
        ];

        expect(calculateStreak(activities)).toBe(2);
    });

    it('should return 1 if two activities yesterday', () => {
        const activities = [
            {start: today - ONE_DAY, end: today - ONE_DAY - ONE_HOUR},
            {start: today - ONE_DAY, end: today - ONE_DAY - ONE_HOUR},
            {start: today},
        ];

        expect(calculateStreak(activities)).toBe(1);
    });

    it('should return 3', () => {
        const activities = [
            {start: today, end: today - ONE_HOUR},
            {start: today - ONE_DAY, end: today - ONE_DAY - ONE_HOUR},
            {start: today - ONE_DAY, end: today - ONE_DAY - ONE_HOUR},
            {start: today - TWO_DAYS, end: today - TWO_DAYS - ONE_HOUR},
        ];

        expect(calculateStreak(activities)).toBe(3);
    });

    it('should return 3 if consequential activities from yesterday', () => {
        const activities = [
            {start: today - FOUR_DAYS, end: today - FOUR_DAYS - ONE_HOUR},
            {start: today - TWO_DAYS, end: today - TWO_DAYS - ONE_HOUR},
            {start: today - TWO_DAYS, end: today - TWO_DAYS - ONE_HOUR},
            {start: today - ONE_DAY, end: today - ONE_DAY - ONE_HOUR},
            {start: today - ONE_DAY, end: today - ONE_DAY - ONE_HOUR},
            {start: today, end: today - ONE_HOUR},
        ];

        expect(calculateStreak(activities)).toBe(3);
    });

    it('should correct consequential streak event if activities are not ordered', () => {
        const activities = [
            {start: today - ONE_DAY, end: today - ONE_DAY - ONE_HOUR},
            {start: today - FOUR_DAYS, end: today - FOUR_DAYS - ONE_HOUR},
            {start: today, end: today - ONE_HOUR},
            {start: today - TWO_DAYS, end: today - TWO_DAYS - ONE_HOUR},
            {start: today - ONE_DAY, end: today - ONE_DAY - ONE_HOUR},
            {start: today - TWO_DAYS, end: today - TWO_DAYS - ONE_HOUR},
        ];

        expect(calculateStreak(activities)).toBe(3);
    });
});