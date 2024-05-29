import {ActivityHighScore} from "../molecules/ActivityHighScore";
import {LastSessions} from "../LastSessions";
import {LastWeekDataStrip} from "../LastWeekDataStrip";
import {ActivitiesEntriesView} from "../views/ActivitiesEntriesView";
import {ActivityPriority} from "../molecules/ActivityPriority";
import {ActivityStreak} from "../molecules/ActivityStreak";
import {Badge} from "../atoms/Badge";
import {useMemo} from "react";
import {getConsequentialWeekData} from "../../utils/session";
import {ACTIVITY_MINIMUM_TIME} from "../../constants/activities";

export const ActivityDataSection = ({
    activitiesData,
    dayByDayData = [],
    activity,
    setIsEditEntryView,
    isEditEntryView
}) => {
    const duration = Math.round(dayByDayData.at(-1)?.duration) || 0;

    return (
        <section className="flex flex-col items-center justify-center gap-4 mx-auto">
            <div className="grid grid-cols-3 w-60 m-auto align-baseline">
                {/*<ActivityPriority activity={activity}/>*/}
                <Badge value={`${duration}h`} label="Today"/>
                <ActivityStreak activities={activitiesData}/>
                <ActivityHighScore activities={activitiesData}/>
            </div>
            {/*<LastSessions*/}
            {/*    activitiesData={activitiesData}*/}
            {/*    activity={activity}/>*/}
            <ActivitiesEntriesView
                isOpen={isEditEntryView}
                onClose={() => setIsEditEntryView(false)}
                entries={activitiesData.map(item => ({
                    id: item.id,
                    start: item.start,
                    end: item.end,
                    name: activity.name,
                }))}/>
        </section>
    )
}