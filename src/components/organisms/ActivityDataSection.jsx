import {ActivityHighScore} from "../molecules/ActivityHighScore";
import {LastSessions} from "../LastSessions";
import {LastWeekDataStrip} from "../LastWeekDataStrip";
import {ActivitiesEntriesView} from "../views/ActivitiesEntriesView";
import {ActivityPriority} from "../molecules/ActivityPriority";
import {ActivityStreak} from "../molecules/ActivityStreak";

export const ActivityDataSection = ({activitiesData, activity, setIsEditEntryView, isEditEntryView}) => {
    return (
        <section className="flex flex-col items-center justify-center gap-4 mx-auto">
            <div className="flex justify-between w-48 mb-4">
                <ActivityPriority activity={activity}/>
                <ActivityHighScore activities={activitiesData}/>
                <ActivityStreak activities={activitiesData}/>
            </div>
            {/*<LastSessions*/}
            {/*    activitiesData={activitiesData}*/}
            {/*    activity={activity}/>*/}
            <LastWeekDataStrip
                data={activitiesData}
                activity={activity}/>
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