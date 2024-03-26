import {ChartBar, House, Lock, LockOpen, YinYang, Coffee, ClockCounterClockwise} from "@phosphor-icons/react";
import classNames from "classnames";
import {useMemo} from "react";
import {Views} from "../App";

const HeaderStyle = ({children}) => {
    return (
        <div
            className="fixed w-fit inset-x-0 m-auto bottom-6 flex items-center justify-center border-t border-gray-300 gap-8 py-4 px-8">
            {children}
        </div>
    );
};

export const Header = ({
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
            <HeaderStyle>
                <YinYang size={32} onClick={onZenMode}/>
            </HeaderStyle>
        );
    }

    return (
        <>
            <HeaderStyle>
                <House
                    size={32}
                    className="cursor-pointer"
                    onClick={() => window.location.reload()}/>
                <ChartBar
                    size={32}
                    className="cursor-pointer"
                    onClick={() => {
                        const page = view === Views.STATS ? "/activity" : "/stats";
                        window.history.pushState({}, "", page);
                        setView(view === Views.STATS ? Views.ACTIVITY : Views.STATS);
                    }}/>
                <YinYang size={32} onClick={onZenMode}/>
                <ClockCounterClockwise size={32} onClick={onEntryHistoryClick}/>
                <Coffee size={32} className="cursor-pointer"/>
            </HeaderStyle>

            <div
                className={classNames({
                    "absolute top-5 right-5": true,
                    "w-fit flex items-center justify-center gap-2": true,
                    "py-2 px-4 rounded-2xl": true,
                })}
                style={{
                    backgroundColor: hasBackgroundActivity
                        ? currentActivity.color
                        : "transparent"
                }}>
                <LockIcon size={32} className="cursor-pointer"/>
                <span className="text-sm">{hasBackgroundActivity ? `${currentActivity.name}` : ""}</span>
            </div>
        </>
    );
}