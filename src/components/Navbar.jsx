import {ChartBar, House, Lock, LockOpen, YinYang, ClockCounterClockwise, CalendarDots} from "@phosphor-icons/react";
import classNames from "classnames";
import {useMemo} from "react";
import {Views} from "../App";

const NavbarStyle = ({children}) => {
    return (
        <div
            className="fixed w-fit z-20 inset-x-0 m-auto bottom-6 flex items-center justify-center border-t border-gray-300/50 gap-10 py-4 px-8">
            {children}
        </div>
    );
};

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
    const LockIcon = useMemo(() => {
        return isLocked ? Lock : LockOpen;
    }, [isLocked]);
    const hasBackgroundActivity = useMemo(() => {
        return currentActivity.name && activity.name !== currentActivity.name;
    }, [currentActivity, activity]);

    if (isZenMode) {
        return (
            <NavbarStyle>
                <YinYang size={32} onClick={onZenMode}/>
            </NavbarStyle>
        );
    }

    return (
        <>
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

            {view === Views.HOMEPAGE
                ? <div
                    className={classNames({
                        "absolute z-10 top-5": true,
                        "w-full flex justify-between px-4": true,
                    })}>
                    <div
                        className={classNames({
                            "flex p-2 rounded-2xl items-center justify-center gap-2": true,
                        })}
                        style={{
                            backgroundColor: hasBackgroundActivity
                                ? currentActivity.color
                                : "transparent"
                        }}>
                        <LockIcon size={32} className="cursor-pointer"/>
                        <span className="text-sm">{hasBackgroundActivity ? `${currentActivity.name}` : ""}</span>
                    </div>
                    <div className="flex gap-4">
                        <ClockCounterClockwise size={32} onClick={onEntryHistoryClick}/>
                        <YinYang size={32} onClick={onZenMode}/>
                    </div>
                </div> : null}
        </>
    );
}