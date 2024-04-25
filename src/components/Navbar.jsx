import {ChartBar, House, Lock, LockOpen, YinYang, ClockCounterClockwise, CalendarDots} from "@phosphor-icons/react";
import classNames from "classnames";
import {useMemo} from "react";

import {Views} from "./views/ActivitiesApp";

const NavbarStyle = ({children}) => {
    return (
        <div
            className="absolute w-fit z-10 inset-x-0 m-auto bottom-6 flex items-center justify-center border-t border-gray-300/50 gap-10 py-4 px-8">
            {children}
        </div>
    );
};

const ActionBar = ({currentActivity, isLocked, activity, onEntryHistoryClick, onZenMode, isZenMode}) => {
    const LockIcon = useMemo(() => {
        return isLocked ? Lock : LockOpen;
    }, [isLocked]);
    const hasBackgroundActivity = useMemo(() => {
        return currentActivity.name && activity.name !== currentActivity.name;
    }, [currentActivity, activity]);

    return (
        <div
            className={classNames({
                "absolute top-5": true,
                "w-full flex justify-between items-center px-4": true,
                "z-10": !isZenMode,
                "z-20": isZenMode
            })}>
            <div
                className={classNames({
                    "opacity-0 pointer-events-none": isZenMode,
                    "flex p-2 rounded-2xl items-center justify-center gap-2": true,
                })}
                style={{
                    backgroundColor: hasBackgroundActivity
                        ? currentActivity.color
                        : "transparent"
                }}>
                <LockIcon size={32} className={classNames({
                    "cursor-pointer": true,
                })}/>
                <span className="text-sm">
                    {hasBackgroundActivity ? `${currentActivity.name}` : ""}
                </span>
            </div>
            <div className="flex gap-4">
                <ClockCounterClockwise
                    className={classNames({
                        "cursor-pointer": true,
                        "opacity-0 pointer-events-none": isZenMode
                    })}
                    size={32} onClick={onEntryHistoryClick}/>
                <YinYang
                    size={32}
                    onClick={onZenMode}
                    weight={isZenMode ? "fill" : "regular"}
                />
            </div>
        </div>
    );
}

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
            </NavbarStyle>
        </>
    );
}