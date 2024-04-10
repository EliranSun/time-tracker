import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';
import {useMemo} from "react";

export const ActivitiesPieChart = ({activities = []}) => {
    const data = useMemo(() => {
        return activities.map(activity => ({
            name: activity.name,
            value: activity.totalTime,
            color: activity.color,
        }));
    }, [activities]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width={window.innerWidth} height={window.innerHeight * 0.8}>
                <Pie
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color}/>
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}
