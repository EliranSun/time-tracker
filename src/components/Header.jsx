import {ChartBar, House, Lock, LockOpen, YinYang, Coffee} from "@phosphor-icons/react";
import classNames from "classnames";
import {useMemo} from "react";
import {Views} from "../App";

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

    console.log({view, isZenMode});
    if (view === Views.STATS)
        return null;

    if (isZenMode)
        return (
            <div className="mt-4 flex justify-end w-screen px-4">
                <YinYang size={32} onClick={onZenMode}/>
            </div>
        );

    return (
        <>
            <div className="fixed bottom-10 flex items-center justify-center border-t border-gray-200 gap-8 px-8">
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
            </div>

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
                {/*<span className="text-sm">{hasBackgroundActivity ? `${currentActivity.name}` : ""}</span>*/}
            </div>
        </>
    );
}