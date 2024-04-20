export const ViewTypes = {
    AGGREGATE: "aggregate",
    DETAIL: "detail",
    PIE: "piechart",
};
export const ViewNav = {
    [ViewTypes.AGGREGATE]: ViewTypes.DETAIL,
    [ViewTypes.DETAIL]: ViewTypes.PIE,
    [ViewTypes.PIE]: ViewTypes.AGGREGATE,
};
export const MARGINS = 16;
export const ONE_HOUR_ACTIVITY_HEIGHT = 50;
export const NAV_BAR_HEIGHT = 65;
const CONTROL_STRIP_HEIGHT = 16;
export const HEADER_HEIGHT = 56 + CONTROL_STRIP_HEIGHT;
const STATS_NAVIGATION_HEIGHT = 70;
export const BOTTOM_MARGIN = 24 + STATS_NAVIGATION_HEIGHT;
export const HEIGHT_BY_WINDOW = window.innerHeight - NAV_BAR_HEIGHT - HEADER_HEIGHT - BOTTOM_MARGIN;