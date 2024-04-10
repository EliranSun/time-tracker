import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';
import {useMemo} from "react";
import {Activities} from "../../constants/activities";

const mockData = [
    {name: 'Group A', value: 400, color: "red"},
    {name: 'Group B', value: 300, color: "green"},
    {name: 'Group C', value: 300, color: "blue"},
    {name: 'Group D', value: 200, color: "yellow"},
    {name: 'Group E', value: 278, color: "orange"},
    {name: 'Group F', value: 189, color: "tomato"},
];

const CustomLabel = ({x, y, payload}) => {
    return (
        <text x={x} y={y} fill={payload.color} textAnchor="middle">
            {payload.name} - {payload.value}
        </text>
    );
};

export const ActivitiesPieChart = ({activities = []}) => {
    const data = useMemo(() => {
        return activities.map(item => ({
            name: item.activity.name,
            value: Math.round(item.totalTime / 60 / 60 / 1000),
            color: item.activity.color,
        }));
    }, [activities]);

    const size = Math.min(window.innerWidth, window.innerHeight);
    const outerRadius = (size * 0.9) / 4; // Example to make the pie chart 90% of the viewport size, adjust as needed


    return (
        <div className="w-full flex items-center justify-center">
            <PieChart
                width={window.innerWidth * 0.9} height={window.innerHeight}>
                <Pie
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={outerRadius}
                    label={CustomLabel}
                    fill="#8884d8"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color}/>
                    ))}
                </Pie>
            </PieChart>
        </div>
    );
}
