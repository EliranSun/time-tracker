import {Highscore} from "../Highscore";
import {LastSession} from "../LastSession";
import {LastSessions} from "../LastSessions";
import {LastWeekDataStrip} from "../LastWeekDataStrip";
import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {ClockCounterClockwise} from "@phosphor-icons/react";
import {ActivitiesEntriesView} from "../views/ActivitiesEntriesView";

const UPPER_DIV_HEIGHT = 40;

export const ActivityDataSection = ({activitiesData, activity, onActivitiesDataEdit}) => {
    const ref = useRef(null);
    const [yPosition, setYPosition] = useState(0);
    const [domReady, setDomReady] = useState(false);
    const [isEditEntryView, setIsEditEntryView] = useState(false);

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
        <section className="flex flex-col items-center justify-center gap-4 w-32 mx-auto" ref={ref}>
            <Highscore activities={activitiesData}/>
            <div className="w-full text-sm flex justify-between">
                <span>Streak:</span>
                <span>0</span>
            </div>
            <LastSessions
                activitiesData={activitiesData}
                activity={activity}/>
            <ClockCounterClockwise size={32} onClick={() => {
                setIsEditEntryView(true);
                onActivitiesDataEdit(true);
            }}/>
            <LastWeekDataStrip data={activitiesData} activity={activity}/>
            <ActivitiesEntriesView
                isOpen={isEditEntryView}
                onClose={() => {
                    setIsEditEntryView(false);
                    onActivitiesDataEdit(false);
                }}
                entries={activitiesData.map(item => ({
                    id: item.id,
                    start: item.start,
                    end: item.end,
                    name: activity.name,
                }))}/>
        </section>
    )
}