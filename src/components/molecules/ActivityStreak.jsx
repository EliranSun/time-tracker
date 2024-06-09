import {Badge} from "../atoms/Badge";
import {useMemo} from "react";
import {calculateStreak} from "../../utils/activities";

export const ActivityStreak = ({activities = []}) => {
    const streak = useMemo(() => {
        return calculateStreak(activities);
    }, [activities]);

    return <Badge value={streak} label="Streak" size={window.innerWidth > 400 ? Badge.Size.LARGE : Badge.Size.SMALL}/>
};