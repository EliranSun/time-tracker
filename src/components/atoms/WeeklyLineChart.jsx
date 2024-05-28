import React, {useState} from 'react';
import {
    ComposedChart,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Brush
} from 'recharts';

// Sample data
// const data = [
//     {name: 'S', h: 3},
//     {name: 'M', h: 2},
//     {name: 'T', h: 1},
//     {name: 'W', h: 1.5},
//     {name: 'T', h: 4},
//     {name: 'F', h: 5},
//     {name: 'S', h: 1},
//     {name: 'S', h: 3},
//     {name: 'M', h: 2},
//     {name: 'T', h: 1},
//     {name: 'W', h: 1.5},
//     {name: 'T', h: 4},
//     {name: 'F', h: 5},
//     {name: 'S', h: 1},
// ];

export const WeeklyLineChart = ({data = []}) => {
    const [brushEndIndex, setBrushEndIndex] = useState(data.length);

    return (
        <ResponsiveContainer width={window.innerWidth * 0.8} height={150}>
            <ComposedChart data={data}>
                <CartesianGrid stroke="#f5f5f5"/>
                <XAxis dataKey="dayName"/>
                <YAxis/>
                <Legend/>
                <Line type="basis" dataKey="duration" stroke="black" dot={false}/>
                <Brush
                    dataKey="dayName"
                    startIndex={data.length - 10}
                    endIndex={brushEndIndex}
                    onChange={(e) => setBrushEndIndex(e.endIndex)}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};
