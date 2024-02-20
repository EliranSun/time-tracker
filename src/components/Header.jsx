import {ArrowCounterClockwise, ChartBar, Lock, LockOpen} from "@phosphor-icons/react";
import classNames from "classnames";
import {useMemo} from "react";
import {Activities} from "../constants/activities";

export const Header = ({
                           isActivityView,
                           setIsActivityView,
                           isLocked,
                           setIsLocked,
                           currentActivity,
                           activePage
                       }) => {
    const LockIcon = useMemo(() =>
        isLocked ? Lock : LockOpen, [isLocked]);
    const activity = Activities.find(activity => activity.name.toLowerCase() === activePage.toLowerCase());
    const hasBackgroundActivity = useMemo(() => {
        return currentActivity.name && activity.name !== currentActivity.name;
    }, [currentActivity, activity]);
    
    return (
        <div className="absolute top-4 left-0 flex justify-between w-screen px-8">
            <div className="flex gap-8">
                    <span>
                        <ArrowCounterClockwise
                            color="white"
                            size={32}
                            className="cursor-pointer"
                            onClick={() => window.location.reload()}/>
                    </span>
                <span>
                        <ChartBar
                            color="white"
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