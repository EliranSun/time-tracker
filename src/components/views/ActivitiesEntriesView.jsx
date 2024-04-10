import {noop} from "lodash";
import {X} from "@phosphor-icons/react";
import {EditableDateTimeEntry} from "../EditableDateTimeEntry";
import {Button} from "../atoms/Button";
import {useMemo} from "react";
import {Activities} from "../../constants/activities";

const ONE_MINUTE = 1 * 60 * 1000;

export const ActivitiesEntriesView = ({entries = [], isOpen = false, onClose = noop}) => {
    const filtered = useMemo(() => {
        return entries
            .filter(item =>
                item.end > 0 &&
                item.start > 0 &&
                item.end - item.start > ONE_MINUTE)
            .sort((a, b) => b.end - a.end);
    }, [entries]);

    if (!isOpen) {
        return null;
    }

    const activity = Activities.find(activity => activity.name === entries[0].name);

    return (
        <dialog
            open={true}
            className="backdrop-blur-xl fixed z-30 flex pt-10 bg-transparent justify-center w-screen h-screen top-0"
            onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
            }}>
            <div
                className="flex items-start flex-col gap-8 font-mono justify-center h-[72vh] rounded-xl">
                <h1 className="text-3xl dark:text-white">
                    {entries[0].id ? "Edit" : "Add"}{" "}
                    <span style={{color: activity.color}}>{entries[0].name}</span>{" "}
                    Entr{entries.length > 1 ? "ies" : "y"}
                </h1>
                <div className="overflow-y-auto overflow-x-hidden h-full flex flex-col gap-2">
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

            <div className="w-full absolute flex justify-center items-center bottom-16 right-16">
                <Button>
                    <X
                        size={52}
                        onClick={onClose}
                        className="dark:text-white hover:text-black"/>
                </Button>
            </div>
        </dialog>
    );
};