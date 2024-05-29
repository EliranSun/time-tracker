import React from 'react';
import {ActivityDisplay} from '../ActivityDisplay';
import {Hourglass} from '@phosphor-icons/react';

// Mock data
const activity = {
    name: 'Thinking',
    icon: Hourglass,
};

const currentActivity = {
    name: 'Thinking',
};

const dayByDayData = [
    {day: 'Monday', data: 5},
    {day: 'Tuesday', data: 3},
    {day: 'Wednesday', data: 4},
];
const today = new Date().getTime();
const ONE_HOUR = 1000 * 60 * 60;
const ONE_DAY = ONE_HOUR * 24;

const activitiesData = [
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

export default {
    title: 'Molecules/ActivityDisplay',
    component: ActivityDisplay,
    argTypes: {
        setIsAddEntryView: {action: 'setIsAddEntryView'},
        setIsEditEntryView: {action: 'setIsEditEntryView'},
    },
};

const IPHONE_13_PRO_MAX_WIDTH = 428;

const Template = (args) =>
    <div className="flex justify-center border border-black" style={{width: IPHONE_13_PRO_MAX_WIDTH}}>
        <ActivityDisplay {...args} />
    </div>;

export const Default = Template.bind({});
Default.args = {
    activity,
    currentActivity,
    lastStartTime: Date.now() - 1000 * 65 * 62,
    isZenMode: false,
    isAddEntryView: false,
    isEditEntryView: false,
    dayByDayData,
    activitiesData,
    swipeHandlers: {},
    isLoading: false,
    textColor: 'black',
};

export const Loading = Template.bind({});
Loading.args = {
    ...Default.args,
    isLoading: true,
};

export const ZenMode = Template.bind({});
ZenMode.args = {
    ...Default.args,
    isZenMode: true,
};

export const AddEntryView = Template.bind({});
AddEntryView.args = {
    ...Default.args,
    isAddEntryView: true,
};

export const EditEntryView = Template.bind({});
EditEntryView.args = {
    ...Default.args,
    isEditEntryView: true,
};