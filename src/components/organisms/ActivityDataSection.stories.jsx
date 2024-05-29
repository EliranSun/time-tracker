import React, {useState} from 'react';
import {ActivityDataSection} from './ActivityDataSection';

const today = new Date().getTime();
const ONE_HOUR = 1000 * 60 * 60;
const ONE_DAY = ONE_HOUR * 24;

const sampleActivitiesData = [
    {
        id: 1,
        start: new Date(today - ONE_DAY * 2).getTime(),
        end: new Date(today - ONE_DAY * 2 + ONE_HOUR * 1.5).getTime()
    },
    {
        id: 2,
        start: new Date(today - ONE_DAY).getTime(),
        end: new Date(today - ONE_DAY + ONE_HOUR * 8).getTime()
    },
    {id: 3, start: new Date(today - ONE_HOUR * 2).getTime(), end: new Date(today - ONE_HOUR).getTime()},

];

const sampleDayByDayData = [
    {day: '2024-05-01', duration: 1},
    {day: '2024-05-02', duration: 2},
    // Add more sample day-by-day data as needed
];

const sampleActivity = {
    name: 'Sample Activity',
    // Add more activity properties if needed
};

export default {
    title: 'Components/ActivityDataSection',
    component: ActivityDataSection,
};

const Template = (args) => {
    const [isEditEntryView, setIsEditEntryView] = useState(false);
    return <ActivityDataSection {...args} isEditEntryView={isEditEntryView} setIsEditEntryView={setIsEditEntryView}/>;
};

export const Default = Template.bind({});
Default.args = {
    activitiesData: sampleActivitiesData,
    dayByDayData: sampleDayByDayData,
    activity: sampleActivity,
};

export const EmptyData = Template.bind({});
EmptyData.args = {
    activitiesData: [],
    dayByDayData: [],
    activity: sampleActivity,
};

export const CustomData = Template.bind({});
CustomData.args = {
    activitiesData: [
        {id: 1, start: '2024-05-03T08:00:00Z', end: '2024-05-03T09:30:00Z'},
        {id: 2, start: '2024-05-04T07:30:00Z', end: '2024-05-04T08:45:00Z'},
    ],
    dayByDayData: [
        {day: '2024-05-03', duration: 1.5},
        {day: '2024-05-04', duration: 1.25},
    ],
    activity: {
        name: 'Custom Activity',
    },
};