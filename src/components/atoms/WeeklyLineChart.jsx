import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Brush
} from 'recharts';
import {getAppTextColor, calcAlphaChannelBasedOnOpacity} from "../../utils/colors";

export const WeeklyLineChart = ({data = []}) => {
    const color = getAppTextColor();
    const opacity = calcAlphaChannelBasedOnOpacity(0.05);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
                <CartesianGrid stroke={`#f5f5f5${opacity}`}/>
                <XAxis dataKey="dayName"/>
                <YAxis/>
                <Tooltip/>
                <Line type="basis" dataKey="duration" stroke={color} dot={false}/>
                <Brush
                    dataKey="dayName"
                    opacity={0.2}
                    fill={`#f5f5f5${opacity}`}
                    startIndex={data.length - 10}
                    endIndex={data.length - 1}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};
