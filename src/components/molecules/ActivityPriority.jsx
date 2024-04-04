import {Badge} from "../atoms/Badge";

export const ActivityPriority = ({activity}) => {
    return <Badge value={activity.priority} label="Priority"/>;
};
