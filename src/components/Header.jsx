import { ArrowCounterClockwise, ChartBar, Lock, LockOpen } from "@phosphor-icons/react";
import classNames from "classnames";
import { useMemo } from "react";
import { Activities } from "../constants/activities";

export const Header = ({
    activity,
    isActivityView,
    setIsActivityView,
    isLocked,
    setIsLocked,
    currentActivity = {},
}) => {
    const LockIcon = useMemo(() => {
        return isLocked ? Lock : LockOpen;
    }, [isLocked]);
    const hasBackgroundActivity = useMemo(() => {
        return currentActivity.name && activity.name !== currentActivity.name;
    }, [currentActivity, activity]);

    return (
        <div className="absolute top-4 left-0 flex justify-between w-screen px-8">
            <div className="flex gap-8">
                <span>
                    <ArrowCounterClockwise
                        size={32}
                        className="cursor-pointer"
                        onClick={() => window.location.reload()}/>
                </span>
                <span>
                    <ChartBar
                        size={32}
                        className="cursor-pointer"
                        onClick={() => setIsActivityView(!isActivityView)}/>
                </span>
            </div>
            <div
                style={{
                    backgroundColor: hasBackgroundActivity ? currentActivity.color : "transparent"
                }}
                className={classNames("flex items-center justify-end gap-2", {
                    "text-xl px-4 py-2 rounded-2xl": hasBackgroundActivity,
                })}>
                <LockIcon
                    size={32}
                    className="cursor-pointer"
                    onClick={() => setIsLocked(!isLocked)}/>
                {hasBackgroundActivity ? `${currentActivity.name}` : ""}
            </div>
        </div>
    );
}