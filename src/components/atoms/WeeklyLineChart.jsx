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

export const WeeklyLineChart = ({data = []}) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
                <CartesianGrid stroke="#f5f5f5"/>
                <XAxis dataKey="dayName"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Line type="basis" dataKey="duration" stroke="black" dot={false}/>
                <Brush
                    dataKey="dayName"
                    startIndex={data.length - 10}
                    endIndex={data.length - 1}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};
