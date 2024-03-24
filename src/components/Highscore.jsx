import {formatDuration} from "../utils/session";

export const Highscore = ({activities = []}) => {
    const sortedByTime = activities.sort((a, b) => (b.end - b.start) - (a.end - a.start));
    const highscore = sortedByTime[0]?.end - sortedByTime[0]?.start;

    return (
        <span className="w-full text-sm flex gap-1">
            <i>Highscore: </i>
            <span className="font-mono font-bold">{formatDuration(highscore || 0)}</span>
        </span>
    )
};
