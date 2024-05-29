import React from 'react';
import {WeeklyLineChart} from '../WeeklyLineChart';

// Sample data for the chart
const sampleData = [
    {dayName: 'Monday', duration: 120},
    {dayName: 'Tuesday', duration: 150},
    {dayName: 'Wednesday', duration: 100},
    {dayName: 'Thursday', duration: 80},
    {dayName: 'Friday', duration: 200},
    {dayName: 'Saturday', duration: 300},
    {dayName: 'Sunday', duration: 50},
];

export default {
    title: 'Components/WeeklyLineChart',
    component: WeeklyLineChart,
};

const Template = (args) => <WeeklyLineChart {...args} />;

export const Default = Template.bind({});
Default.args = {
    data: sampleData,
};

export const EmptyData = Template.bind({});
EmptyData.args = {
    data: [],
};

export const CustomData = Template.bind({});
CustomData.args = {
    data: [
        {dayName: 'Monday', duration: 10},
        {dayName: 'Tuesday', duration: 20},
        {dayName: 'Wednesday', duration: 30},
        {dayName: 'Thursday', duration: 40},
        {dayName: 'Friday', duration: 50},
        {dayName: 'Saturday', duration: 60},
        {dayName: 'Sunday', duration: 70},
    ],
};
