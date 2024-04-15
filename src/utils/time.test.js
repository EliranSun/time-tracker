import {getTimeString} from "./time";

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;

describe('Time Util', () => {
    describe("getTimeString", () => {
        it("Should return 1h if activityTotalTime is 1 hour", () => {
            const activityTotalTime = ONE_MINUTE * 60;
            expect(getTimeString(activityTotalTime)).toBe("1h");
        });

        it("Should return 1h if activityTotalTime is 1 hour and 1 minute", () => {
            const activityTotalTime = ONE_MINUTE * 61;
            expect(getTimeString(activityTotalTime)).toBe("1h");
        });

        it("Should return 1h30m if activityTotalTime is 1 hour and 33 minutes", () => {
            const activityTotalTime = ONE_MINUTE * 93; // 1 hour and 33 minutes
            expect(getTimeString(activityTotalTime)).toBe("1h30m");
        });

        it("Should return 1h40m if activityTotalTime is 1 hour and 35 minutes", () => {
            const activityTotalTime = ONE_MINUTE * 95; // 1 hour and 35 minutes
            expect(getTimeString(activityTotalTime)).toBe("1h40m");
        });

        it("Should return 2h if activityTotalTime is 1 hour and 55 minutes", () => {
            const activityTotalTime = ONE_HOUR + ONE_MINUTE * 55; // 1 hour and 55 minutes
            expect(getTimeString(activityTotalTime)).toBe("2h");
        });

        it("Should return 1h10m if activityTotalTime is 1 hour and 10 minutes", () => {
            const activityTotalTime = ONE_MINUTE * 70; // 1 hour and 10 minutes
            expect(getTimeString(activityTotalTime)).toBe("1h10m");
        });

        it("Should return 1h if activityTotalTime is 1 hour and 60 minutes", () => {
            const activityTotalTime = ONE_MINUTE * 60;
            expect(getTimeString(activityTotalTime)).toBe("1h");
        });

        it("Should return <1h if activityTotalTime is 50 minutes", () => {
            const activityTotalTime = ONE_MINUTE * 50;
            expect(getTimeString(activityTotalTime)).toBe("<1h");
        });

        it("Should return empty string if activityTotalTime is 0", () => {
            const activityTotalTime = 0;
            expect(getTimeString(activityTotalTime)).toBe("");
        });
    });
});