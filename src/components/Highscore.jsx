import { formatTimestamp } from "../utils/time";

export const Highscore = ({ activities = [] }) => {
    const sortedByTime = activities.sort((a, b) => (b.end - b.start) - (a.end - a.start));
    const highscore = sortedByTime[0]?.end - sortedByTime[0]?.start;

    return (
        <span className="text-sm text-gray-700">
            <i>High Score:</i>{' '}
            <span className="font-mono">{formatTimestamp(highscore || 0)}</span>
        </span>
    )
};