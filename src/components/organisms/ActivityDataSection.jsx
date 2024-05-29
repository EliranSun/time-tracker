import {ActivityHighScore} from "../molecules/ActivityHighScore";
import {ActivitiesEntriesView} from "../views/ActivitiesEntriesView";
import {ActivityStreak} from "../molecules/ActivityStreak";
import {Badge} from "../atoms/Badge";
import {ArrowUp} from "@phosphor-icons/react";

export const ActivityDataSection = ({
    activitiesData,
    dayByDayData = [],
    activity,
    setIsEditEntryView,
    isEditEntryView
}) => {
    const duration = Math.round(dayByDayData.at(-1)?.duration) || 0;
    console.log({activitiesData});
    return (
        <section className="flex flex-col items-center justify-center gap-4 mx-auto">
            <div className="grid grid-cols-3 w-60 m-auto align-baseline">
                {/*<ActivityPriority activity={activity}/>*/}
                <div className="flex gap-px">
                    <Badge
                        label="Today"
                        value={
                            <div className="flex items-center">
                                <span>{duration}h</span>
                                <ArrowUp size={16} color="black"/>
                            </div>
                        }/>
                </div>
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