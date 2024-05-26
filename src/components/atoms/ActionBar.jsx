import {useMemo} from "react";
import {ClockCounterClockwise, Lock, LockOpen, YinYang} from "@phosphor-icons/react";
import classNames from "classnames";

export const ActionBar = ({currentActivity, isLocked, activity, onEntryHistoryClick, onZenMode, isZenMode}) => {
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