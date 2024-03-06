import {ArrowCounterClockwise, ChartBar, Lock, LockOpen, YinYang} from "@phosphor-icons/react";
import classNames from "classnames";
import {useMemo} from "react";

export const Header = ({
                           activity,
                           isActivityView,
                           setIsActivityView,
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

    if (!isActivityView)
        return null;

    if (isZenMode)
        return (
            <div className="absolute top-4 left-0 flex justify-end w-screen px-8">
                <YinYang size={32} onClick={onZenMode}/>
            </div>
        );

    return (
        <div className="absolute top-4 left-0 flex justify-between w-screen px-8">
            <div className="flex gap-8">
                <ArrowCounterClockwise
                    size={32}
                    className="cursor-pointer"
                    onClick={() => window.location.reload()}/>
                <ChartBar
                    size={32}
                    className="cursor-pointer"
                    onClick={() => {
                        const page = !isActivityView ? "/activity" : "/stats";
                        window.history.pushState({}, "", page);
                        setIsActivityView(!isActivityView);
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