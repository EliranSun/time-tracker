import React from 'react';
import {ActivityTitle} from '../ActivityTitle'; // Adjust the path as necessary

export default {
    title: 'Components/ActivityTitle',
    component: ActivityTitle,
};

const IPHONE_13_PRO_MAX_WIDTH = 428;
const Template = (args) =>
    <div className="flex justify-center border border-black" style={{width: IPHONE_13_PRO_MAX_WIDTH}}>
        <ActivityTitle {...args} />
    </div>;

export const ZenMode = Template.bind({});
ZenMode.args = {
    name: 'Zen Mode',
    isZenMode: true,
};

export const RegularMode = Template.bind({});
RegularMode.args = {
    name: 'Regular Mode',
    isZenMode: false,
};