import {useCallback, useState} from "react";
import {addActivityData, getRefByPath, updateActivityData} from "../utils/db";
import {getAppBackgroundColor, replaceMetaThemeColor} from "../utils/colors";

export const useTimers = ({activity, currentActivity, onActivityStart, onActivityEnd}) => {
    const [refPath, setRefPath] = useState("");
    const [updateCount, setUpdateCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    
    const onStartTick = useCallback((startTime) => {
        setIsLoading(true);
        setLogs(prev => [...prev, { m: "onStartTick" }]);
        
        addActivityData({
            name: activity.name,
            start: startTime,
            end: 0
        }).then(ref => {
            const refPath = ref.path;
            const data = {
                name: activity.name,
                color: activity.color,
                start: startTime,
                end: 0,
                refPath
            };
            localStorage.setItem('currentActivity', JSON.stringify(data));
            onActivityStart(data);
            replaceMetaThemeColor(activity.color);
            setIsLoading(false);
            setRefPath(refPath);
                    setLogs(prev => [...prev, { m: "onStartTick", data }]);
        }).catch(error => {
            alert(`Error adding data: ${error.message}`);
            setIsLoading(false);
                    setLogs(prev => [...prev, { m: "error", error }]);
        });
    }, [activity]);

    const onStopTick = useCallback(() => {
        onActivityEnd();
        replaceMetaThemeColor(getAppBackgroundColor());
        
        let storedActivity = {};
        try {
            storedActivity = JSON.parse(localStorage.getItem("currentActivity"));
        } catch (error) {
            setLogs(prev => [...prev, { m: "error", error }]);
        }
        
        const ref = getRefByPath(refPath || storedActivity.refPath);
        const endTime = new Date().getTime();
                setLogs(prev => [...prev, { m: "onEndTick", refPath, activity, storedActivity, endTime }]);
                
        if (!refPath) {
            setLogs(prev => [...prev, { m: "error", "no ref path found" }]);
            alert(`No ref path found: ${refPath}. aborting update`);
            return;
        }

        updateActivityData(ref, {
            name: activity.name,
            end: endTime
        })
            .then(() => {
                setUpdateCount(prev => prev + 1);
                localStorage.removeItem('currentActivity');
            })
            .catch(error => {
                setLogs(prev => [...prev, { m: "error", error }]);
                alert(`Error updating data: ${error.message}`);
            })
    }, [activity.name, refPath]);

    const activityToggle = useCallback(() => {
        const shouldStartTick = !currentActivity.name;
        const shouldStopTick = currentActivity.name === activity.name;

        if (shouldStartTick) {
            onStartTick(new Date().getTime());
            return;
        }

        if (shouldStopTick) {
            onStopTick();
        }
    }, [currentActivity.name, activity.name]);

    return {
        setRefPath,
        toggle: activityToggle,
        count: updateCount,
        isLoading,
        logs
    };
}