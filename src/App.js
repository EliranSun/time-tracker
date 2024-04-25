import './App.css';
import {useContext, useEffect, useState} from "react";
import {ActivitiesContext} from "./context/ActivitiesContext";
import {ActivitiesApp} from "./components/views/ActivitiesApp";
import {ActivitiesDungeonMap} from "./components/ActivitiesDungeonMap";
import {Question, Wall} from "@phosphor-icons/react";
import {AuthContext} from "./context/AuthContext";
import classNames from "classnames";
import {ColorNames, Colors} from "./constants/activities";
import {usePageSwipe} from "./hooks/usePageSwipe";
import {readableColor} from "polished";
import {upperCase} from "lodash";
import {replaceMetaThemeColor} from "./utils/colors";

const useMessagesFlipper = (length, flipInSeconds, stopAtEnd = false) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (stopAtEnd && index === length - 1) {
            return;
        }

        const interval = setInterval(() => {
            setIndex((index + 1) % length);
        }, flipInSeconds * 1000);

        return () => clearInterval(interval);
    }, [index, length, flipInSeconds, stopAtEnd]);

    return index;
}

function App() {
    const {user} = useContext(AuthContext);
    const [allActivities] = useContext(ActivitiesContext);
    const [colorPageName, setColorPageName] = useState(ColorNames.SELECTIVE_YELLOW);
    const textColor = readableColor(Colors[colorPageName].value);

    const [messages, setMessages] = useState([
        `Hello ${user.displayName}`,
        `Set up to 6 activities you care about`,
        `Another 6, locked up for now ;)`,
        `Swipe to begin, Tap to edit`
    ]);
    const messageIndex = useMessagesFlipper(messages.length, 4, true);
    const swipeHandlers = usePageSwipe({
        onSwipe: pageName => {
            setColorPageName(pageName);
        },
    });

    const items = Object.entries(Colors).sort((a, b) => {
        return a[1].order - b[1].order;
    })

    useEffect(() => {
        replaceMetaThemeColor(Colors[colorPageName].value);
    }, [colorPageName]);

    if (allActivities.length === 0) {
        return (
            <div {...swipeHandlers}
                 style={{backgroundColor: Colors[colorPageName].value, color: textColor}}
                 className="flex flex-col justify-center items-center h-screen select-none">
                {messages.map((message, i) => (
                    <h1 className={classNames("px-4 absolute bottom-10 text-4xl font-mono text-center my-10 transition-all duration-1000", {
                        "opacity-0": i !== messageIndex,
                        "opacity-60": i === messageIndex,
                    })} key={i}>
                        {message}
                    </h1>
                ))}
                <ActivitiesDungeonMap
                    activePage={colorPageName}
                    activities={items.map(([colorName, color]) => {
                        return {
                            name: colorName,
                            color: color.value,
                            isBlocked: color.isBlocked,
                            icon: Question,
                        }
                    })}/>
                <div className="absolute top-10 font-mono mt-16 transition-all duration-1000 w-72">
                    <h1 className="mb-2 font-mono text-5xl">ACTIVITY NAME HERE</h1>
                    <h2 className="mb-2 text-base">{upperCase(colorPageName)}</h2>
                    <div className="flex flex-wrap gap-1">
                        {Colors[colorPageName].tags?.map(tag => (
                            <span
                                key={tag}
                                // style={{backgroundColor: bgColor}}
                                className="text-sm rounded text-white bg-black p-1">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return <ActivitiesApp/>
}

export default App;