import {Highscore} from "../Highscore";
import {LastSession} from "../LastSession";
import {LastSessions} from "../LastSessions";
import {LastWeekDataStrip} from "../LastWeekDataStrip";
import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {ClockCounterClockwise} from "@phosphor-icons/react";
const UPPER_DIV_HEIGHT = 40;

export const ActivityDataSection = ({activitiesData, activity}) => {
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

    console.log({yPosition})
    const container = document.getElementById("scrollable-elements");
    const children = (
        <div className="absolute inset-x-0 m-auto mt-4" style={{top: yPosition + UPPER_DIV_HEIGHT}}>
            <LastSessions
                activitiesData={activitiesData}
                activity={activity}/>
        </div>
    );

    return (
        <section>
            <div className="w-32 mb-28 mx-auto" ref={ref}>
                <Highscore activities={activitiesData}/>
                <LastSession data={activitiesData} activity={activity}/>
                <LastSessions
                activitiesData={activitiesData}
                activity={activity}/>
                <ClockCounterClockwise size={32} />
            </div>
            <LastWeekDataStrip data={activitiesData} activity={activity}/>
        </section>
    )
}