import {Highscore} from "../Highscore";
import {LastSession} from "../LastSession";
import {LastSessions} from "../LastSessions";
import {LastWeekDataStrip} from "../LastWeekDataStrip";

export const ActivityDataSection = ({activitiesData, activity}) => {
    return (
        <section>
            <div className="w-32 mb-16 mx-auto">
                <Highscore activities={activitiesData}/>
                <LastSession data={activitiesData} activity={activity}/>
                <br/>
                <LastSessions activitiesData={activitiesData} activity={activity}/>
            </div>
            <LastWeekDataStrip data={activitiesData} activity={activity}/>
        </section>
    )
}