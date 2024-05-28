import {formatDuration} from "../../utils/session";
import {Badge} from "../atoms/Badge";

export const ActivityHighScore = ({activities = []}) => {
    const sortedByTime = activities.sort((a, b) => (b.end - b.start) - (a.end - a.start));
    const highScore = sortedByTime[0]?.end - sortedByTime[0]?.start;

    return <Badge value={formatDuration(highScore || 0)} label="Highest"/>;
};
