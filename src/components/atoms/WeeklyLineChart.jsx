import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

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
    return (
        <div
            onScroll={event => {
                event.stopPropagation();
                event.preventDefault();
            }}
            style={{width: window.innerWidth, height: '100px', overflowX: 'scroll', overflowY: 'hidden'}}>
            <LineChart
                width={data.length * 50}
                height={130}
                data={data}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                {/*<CartesianGrid strokeDasharray="3 3"/>*/}
                <XAxis dataKey="name"/>
                <YAxis/>
                {/*<Tooltip/>*/}
                <Legend/>
                <Line type="basis" dataKey="measure" stroke="black" activeDot={{r: 8}} dot={false}/>
                {/*<Line type="monotone" dataKey="uv" stroke="#82ca9d"/>*/}
            </LineChart>
        </div>
    );
};
