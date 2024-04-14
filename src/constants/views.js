export const ViewTypes = {
    AGGREGATE: "aggregate",
    DETAIL: "detail",
    PIECHART: "piechart",
};
export const ViewNav = {
    [ViewTypes.AGGREGATE]: ViewTypes.DETAIL,
    [ViewTypes.DETAIL]: ViewTypes.PIECHART,
    [ViewTypes.PIECHART]: ViewTypes.AGGREGATE,
};