import {formatDuration} from "../utils/session";

export const Highscore = ({activities = []}) => {
    const sortedByTime = activities.sort((a, b) => (b.end - b.start) - (a.end - a.start));
    const highscore = sortedByTime[0]?.end - sortedByTime[0]?.start;

    return (
        <span className="text-sm text-gray-700 flex justify-between">
            <i>High Score:</i>{' '}
            <span className="font-mono">{formatDuration(highscore || 0)}</span>
        </span>
    )
};
