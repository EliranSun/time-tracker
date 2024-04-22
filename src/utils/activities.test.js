import {calculateStreak} from "./activities";

const ONE_DAY = 24 * 60 * 60 * 1000;
const TWO_DAYS = 2 * ONE_DAY;
const THREE_DAYS = 3 * ONE_DAY;
const FOUR_DAYS = 4 * ONE_DAY;
const ONE_HOUR = 60 * 60 * 1000;


describe('calculateStreak', () => {
    const today = Date.now();

    it('should return 0 if no activities', () => {
        expect(calculateStreak([])).toBe(0);
    });

    it("should return 0 if no activity today", () => {
        expect(calculateStreak([
            {
                start: today - ONE_DAY,
                end: today - ONE_DAY - ONE_HOUR
            }
        ])).toBe(0);
    });

    it("should return 1 if and activity today", () => {
        expect(calculateStreak([
            {
                start: today,
                end: today - ONE_HOUR
            }
        ])).toBe(1);
    });

    it("should return 2 if activity today and yesterday", () => {
        expect(calculateStreak([
            {
                start: today,
                end: today - ONE_HOUR
            },
            {
                start: today - ONE_DAY,
                end: today - ONE_DAY - ONE_HOUR
            }
        ])).toBe(2);
    });

    it("should return 2 if yesterday and the day before", () => {
        expect(calculateStreak([
            {
                start: today - ONE_DAY,
                end: today - ONE_DAY - ONE_HOUR
            },
            {
                start: today - TWO_DAYS,
                end: today - TWO_DAYS - ONE_HOUR
            }
        ])).toBe(2);
    });

    it("should return 2 for the first consequence", () => {
        expect(calculateStreak([
            {
                start: today, // 22
                end: today - ONE_HOUR
            },
            {
                start: today - ONE_DAY, // 21
                end: today - ONE_DAY - ONE_HOUR
            },
            {
                start: today - THREE_DAYS, // 19
                end: today - THREE_DAYS - ONE_HOUR
            },
            {
                start: today - FOUR_DAYS, // 18
                end: today - FOUR_DAYS - ONE_HOUR
            }
        ])).toBe(2);
    });

    it("should return 3 for the first consequence", () => {
        expect(calculateStreak([
            {
                start: today - ONE_DAY, // 21
                end: today - ONE_DAY - ONE_HOUR
            },
            {
                start: today - TWO_DAYS, // 19
                end: today - TWO_DAYS - ONE_HOUR
            },
            {
                start: today - THREE_DAYS, // 18
                end: today - THREE_DAYS - ONE_HOUR
            }
        ])).toBe(3);
    });
});