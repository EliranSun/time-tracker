import {CalendarDots, ChartBar, ChartLine, HourglassHigh, House} from "@phosphor-icons/react";
import {Views} from "../App";
import {ActionBar} from "./atoms/ActionBar";
import {NavbarStyle} from "./atoms/NavbarStyle";

export const Navbar = ({
    activity,
    view,
    setView,
    isLocked,
    currentActivity = {},
    onZenMode,
    isZenMode,
    onEntryHistoryClick
}) => {

    if (isZenMode && view === Views.HOMEPAGE) {
        return (
            <ActionBar
                isZenMode
                currentActivity={currentActivity}
                isLocked={isLocked}
                activity={activity}
                onEntryHistoryClick={onEntryHistoryClick}
                onZenMode={onZenMode}
            />
        );
    }

    return (
        <>
            {view === Views.HOMEPAGE
                ? <ActionBar
                    currentActivity={currentActivity}
                    isLocked={isLocked}
                    activity={activity}
                    onEntryHistoryClick={onEntryHistoryClick}
                    onZenMode={onZenMode}
                /> : null}
            <NavbarStyle>
                <House
                    size={32}
                    className="cursor-pointer"
                    onClick={() => window.history.pushState({}, "", "/")}/>
                <ChartBar
                    size={32}
                    className="cursor-pointer"
                    onClick={() => {
                        const page = view === Views.STATS ? "/activity" : "/stats";
                        window.history.pushState({}, "", page);
                        setView(view === Views.STATS ? Views.ACTIVITY : Views.STATS);
                    }}/>
                <CalendarDots
                    size={32}
                    onClick={() => window.history.pushState({}, "", `/stats/activity/${activity.name.toLowerCase()}`)}
                    className="cursor-pointer"/>
                <ChartLine
                    size={32}
                    onClick={() => window.history.pushState({}, "", `/graph/activity/${activity.name.toLowerCase()}`)}
                    className="cursor-pointer"/>
                <HourglassHigh
                    size={32}
                    onClick={() => window.history.pushState({}, "", "/gravity")}
                    className="cursor-pointer"/>
            </NavbarStyle>
        </>
    );
}