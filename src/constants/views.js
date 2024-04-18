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