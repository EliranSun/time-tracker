import {useEffect, useState} from "react";

import {Views} from "../components/views/ActivitiesApp";

export const useNavigation = () => {
    const [view, setView] = useState(Views.HOMEPAGE);

    useEffect(() => {
        switch (true) {
            default:
            case document.location.pathname === "/":
                setView(Views.HOMEPAGE);
                break;

            case document.location.pathname === "/stats":
                setView(Views.STATS);
                break;

            case document.location.pathname === "/gravity":
                setView(Views.GRAVITY);
                break;

            case document.location.pathname.includes("/stats/activity"):
                setView(Views.ACTIVITY);
                // setActivePage(document.location.pathname.split("/").pop());
                break;
        }

        window.addEventListener("popstate", () => {
            const path = document.location.pathname;
            if (path === "/gravity") {
                setView(Views.GRAVITY);
            }

            if (path === "/") {
                setView(Views.HOMEPAGE);
            }

            if (path === "/stats") {
                setView(Views.STATS);
            }

            if (path.includes("/stats/activity")) {
                setView(Views.ACTIVITY);
                // setActivePage(path.split("/").pop());
            }
        });

        window.history.pushState = new Proxy(window.history.pushState, {
            apply: (target, thisArg, argArray) => {
                // trigger here what you need
                const path = argArray[2];

                if (path === "/gravity") {
                    setView(Views.GRAVITY);
                }

                if (path.includes("/stats/activity")) {
                    setView(Views.ACTIVITY);
                    // setActivePage(path.split("/").pop());
                }

                if (path === "/") {
                    setView(Views.HOMEPAGE);
                }

                if (path === "/stats") {
                    setView(Views.STATS);
                }

                return target.apply(thisArg, argArray);
            },
        });
    }, []);

    return [view, setView];
}