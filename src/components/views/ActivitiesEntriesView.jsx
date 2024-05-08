import {noop} from "lodash";
import {X} from "@phosphor-icons/react";
import {EditableDateTimeEntry} from "../EditableDateTimeEntry";
import {Button} from "../atoms/Button";
import {useMemo} from "react";
import {createPortal} from "react-dom";
import {Activities, ACTIVITY_MINIMUM_TIME} from "../../constants/activities";
import classNames from "classnames";

const Dialog = ({children, onClose}) => {
    return createPortal(
        <dialog
            open={true}
            className={classNames({
                "fixed z-50 w-screen h-[100vh] top-0 overflow-hidden": true,
                "flex justify-center py-8 px-4": true,
                "backdrop-blur-xl bg-transparent": true,
            })}
            onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
            }}>
            {children}

            <div className="absolute flex justify-center items-center bottom-16 right-16">
                <Button>
                    <X
                        size={52}
                        onClick={onClose}
                        className="dark:text-white hover:text-black"/>
                </Button>
            </div>
        </dialog>
        , document.getElementById("dialog-root"));
};

export const ActivitiesEntriesView = ({entries = [], isOpen = false, onClose = noop}) => {
    const filtered = useMemo(() => {
        if (entries.length === 0) return [];

        return entries
            // .filter(item =>
            //     item.end > 0 &&
            //     item.start > 0 &&
            //     item.end - item.start > ACTIVITY_MINIMUM_TIME)
            .sort((a, b) => b.end - a.end);
    }, [entries]);

    if (!isOpen) {
        return null;
    }

    if (entries.length === 0) {
        return (
            <Dialog onClose={onClose}>
                No entries found.
            </Dialog>
        );
    }

    const activity = Activities.find(activity => activity.name === entries[0].name);

    return (
        <Dialog onClose={onClose}>
            <div
                className="w-full flex flex-col h-screen gap-8 font-mono rounded-xl">
                <h1 className="text-3xl dark:text-white">
                    {entries[0].id ? "Edit" : "Add"}{" "}
                    <span style={{color: activity.color}}>{entries[0].name}</span>{" "}
                    Entr{entries.length > 1 ? "ies" : "y"}
                </h1>
                <div
                    className="overflow-y-auto h-[70vh] w-full flex items-center text-center flex-col gap-2">
                    {filtered.map(entry => {
                        return (
                            <EditableDateTimeEntry
                                key={entry.id}
                                id={entry.id}
                                isListView={entries.length > 1}
                                activityName={entry.name}
                                start={entry.start}
                                end={entry.end}/>
                        );
                    })}
                </div>
            </div>
        </Dialog>
    );
};