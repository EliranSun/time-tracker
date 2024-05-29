import {getAppBackgroundColor} from "../../../utils/colors";

export const BackgroundColorOverlay = ({activity, currentActivity}) => {
    return (
        <div
            className="fixed w-screen h-screen top-0 left-0 z-10 flex items-center justify-center"
            style={{
                backgroundColor: currentActivity.name === activity.name
                    ? `${activity.color}`
                    : getAppBackgroundColor()
            }}/>
    );
};