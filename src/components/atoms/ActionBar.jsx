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
                "absolute top-8 left-8": true,
                "flex justify-between items-center": true,
                "z-10": !isZenMode,
                "z-20": isZenMode
            })}>
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
                <div
                    className={classNames({
                        "px-2": hasBackgroundActivity,
                        "opacity-0 pointer-events-none": isZenMode,
                        "flex rounded-xl items-center justify-center": true,
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
            </div>
        </div>
    );
}