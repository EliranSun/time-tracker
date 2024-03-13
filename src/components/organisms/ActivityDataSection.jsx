import {Highscore} from "../Highscore";
import {LastSession} from "../LastSession";
import {LastSessions} from "../LastSessions";
import {LastWeekDataStrip} from "../LastWeekDataStrip";

export const ActivityDataSection = ({activitiesData, activity}) => {
    return (
        <section>
            <div className="w-32 mb-8 mx-auto">
                <Highscore activities={activitiesData}/>
                <LastSession data={activitiesData} activity={activity}/>
                <br/>
                <LastSessions activitiesData={activitiesData}/>
            </div>
            <div className="h-20">
                <LastWeekDataStrip data={activitiesData} activity={activity}/>
            </div>
        </section>
    )
}