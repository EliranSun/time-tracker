import {PieChart, Pie, Cell} from 'recharts';
import {useContext, useMemo, useState} from "react";
import {ActivitiesRainbowFilter} from "../molecules/ActivitiesRainbowFilter";
import {useActivitiesByColorOrder} from "../../hooks/useActivitiesByView";
import {Skull} from "@phosphor-icons/react";
import {ActivitiesFilterContext} from "../../context/ActivitiesFilterContext";

const mockData = [
    {name: 'Group A', value: 400, color: "red"},
    {name: 'Group B', value: 300, color: "green"},
    {name: 'Group C', value: 300, color: "blue"},
    {name: 'Group D', value: 200, color: "yellow"},
    {name: 'Group E', value: 278, color: "orange"},
    {name: 'Group F', value: 189, color: "tomato"},
];

const CustomLabel = ({cx, cy, midAngle, innerRadius, outerRadius, payload}) => {
    // Calculate the radius for positioning the labels outside the pie chart
    const radius = outerRadius + 35; // Increase 30 or adjust as needed for your design

    // Convert polar coordinates (angle, radius) to Cartesian coordinates (x, y)
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
        <text x={x} y={y} fill={payload.color} textAnchor="middle" dominantBaseline="central">
            <tspan x={x} alignmentBaseline="middle">{payload.value}h</tspan>
        </text>
    );
};


// the gap from the center of the pie chart to the outer edge
const outerRadius = window.innerWidth / 3;

export const ActivitiesPieChart = ({activities = [], dateFrame, timeFrame}) => {
    const items = useActivitiesByColorOrder({allActivitiesData: activities, dateFrame, timeFrame});
    const [isFullView, setIsFullView] = useState(false);
    const [filters] = useContext(ActivitiesFilterContext);

    const data = useMemo(() => {
        return items
            .filter(({activity}) => {
                return !filters.includes(activity.name);
            })
            .map(item => ({
                name: item.activity.name,
                value: Math.round(item.totalTime / 60 / 60 / 1000),
                color: item.activity.color,
            }));
    }, [items, filters]);
    
    return (
        <>
            <ActivitiesRainbowFilter items={items}/>
            <div
                onClick={() => setIsFullView(!isFullView)}
                className="flex flex-col justify-center gap-16 h-full">
                <PieChart
                    width={window.innerWidth} height={window.innerHeight / 2}>
                    <Pie
                        dataKey="value"
                        startAngle={0}
                        endAngle={isFullView ? 360 : 180}
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={outerRadius}
                        label={CustomLabel}
                        labelLine={false}
                        fill="#8884d8"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                    </Pie>
                </PieChart>
            </div>
        </>
    );
}
