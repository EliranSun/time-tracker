import {Highscore} from "../Highscore";
import {LastSessions} from "../LastSessions";
import {LastWeekDataStrip} from "../LastWeekDataStrip";
import {useEffect, useRef, useState} from "react";
import {ActivitiesEntriesView} from "../views/ActivitiesEntriesView";

const UPPER_DIV_HEIGHT = 40;

export const ActivityDataSection = ({activitiesData, activity, setIsEditEntryView, isEditEntryView}) => {
    const ref = useRef(null);
    const [yPosition, setYPosition] = useState(0);
    const [domReady, setDomReady] = useState(false);

    useEffect(() => {
        setDomReady(true);
    }, []);

    useEffect(() => {
        if (ref.current) {
            setYPosition(ref.current.getBoundingClientRect().top);
        }
    }, []);

    // const container = document.getElementById("scrollable-elements");
    // const children = (
    //     <div className="absolute inset-x-0 m-auto mt-4" style={{top: yPosition + UPPER_DIV_HEIGHT}}>
    //         <LastSessions
    //             activitiesData={activitiesData}
    //             activity={activity}/>
    //     </div>
    // );

    return (
        <section className="flex flex-col items-center justify-center gap-4 mx-auto" ref={ref}>
            <div className="flex gap-4">
                <Highscore activities={activitiesData}/>
                <div className="w-full text-sm flex gap-1 justify-between">
                    <span>Streak:</span><span className="font-mono font-bold">0d</span>
                </div>
            </div>
            <LastSessions
                activitiesData={activitiesData}
                activity={activity}/>
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