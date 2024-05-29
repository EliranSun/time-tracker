import {Badge} from "../atoms/Badge";

export const ActivityPriority = ({activity}) => {
    return <Badge value={activity.priority || 0} label="Priority" unit={Badge.Unit.NONE}/>;
};
