import { ArrowCounterClockwise, ChartBar, House, Lock, LockOpen, YinYang } from "@phosphor-icons/react";
import classNames from "classnames";
import { useMemo } from "react";
import { Views } from "../App";

export const Header = ({
    activity,
    view,
    setView,
    isLocked,
    currentActivity = {},
    onZenMode,
    isZenMode
}) => {
    const LockIcon = useMemo(() => {
        return isLocked ? Lock : LockOpen;
    }, [isLocked]);
    const hasBackgroundActivity = useMemo(() => {
        return currentActivity.name && activity.name !== currentActivity.name;
    }, [currentActivity, activity]);

    console.log({view,isZenMode});
    if (view === Views.STATS)
        return null;

    if (isZenMode)
        return (
            <div className="mt-4 flex justify-end w-screen px-8">
                <YinYang size={32} onClick={onZenMode}/>
            </div>
        );

    return (
        <div className="flex justify-between w-screen px-8 mt-4">
            <div className="flex gap-8">
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
            </div>
            <div
                className={classNames("flex items-center justify-end gap-8", {
                    "text-xl px-4 py-2 rounded-2xl": hasBackgroundActivity,
                })}
                style={{
                    backgroundColor: hasBackgroundActivity ? currentActivity.color : "transparent"
                }}>
                <LockIcon
                    size={32}
                    className="cursor-pointer"/>
                {hasBackgroundActivity ? `${currentActivity.name}` : ""}
                <YinYang size={32} onClick={onZenMode}/>
            </div>
        </div>
    );
}