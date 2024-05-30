import {ActivityHighScore} from "../molecules/ActivityHighScore";
import {ActivitiesEntriesView} from "../views/ActivitiesEntriesView";
import {ActivityStreak} from "../molecules/ActivityStreak";
import {Badge} from "../atoms/Badge";
import {ArrowUp} from "@phosphor-icons/react";
import {useMemo} from "react";
import {ActivityPriority} from "../molecules/ActivityPriority";

export const ActivityDataSection = ({
    activitiesData,
    dayByDayData = [],
    activity,
    setIsEditEntryView,
    isEditEntryView
}) => {
    const duration = useMemo(() => Math.round(dayByDayData.at(-1)?.duration) || 0, [dayByDayData]);
    const timeSinceLastActivityInDays = useMemo(() => {
        if (activitiesData.length === 0) {
            return 0;
        }

        const timeDiff = new Date().getTime() - activitiesData.at(0).end;
        return Math.round(timeDiff / (1000 * 60 * 60 * 24));
    }, [activitiesData]);

    return (
        <section className="flex flex-col items-center justify-center gap-4 mx-auto">
            <div className="grid grid-cols-5 gap-4 justify-items-center items-end">
                <ActivityPriority activity={activity}/>
                <div className="flex gap-px">
                    <Badge
                        label="Today"
                        unit={Badge.Unit.HOUR}
                        icon={ArrowUp}
                        value={duration}/>
                </div>
                <ActivityStreak activities={activitiesData}/>
                <ActivityHighScore activities={activitiesData}/>
                <div className="flex gap-px">
                    <Badge
                        label="Last"
                        unit={Badge.Unit.DAY}
                        value={timeSinceLastActivityInDays}/>
                </div>
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