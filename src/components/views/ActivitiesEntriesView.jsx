import {noop} from "lodash";
import {X} from "@phosphor-icons/react";
import {EditableDateTimeEntry} from "../EditableDateTimeEntry";
import {Button} from "../atoms/Button";
import {useMemo} from "react";

const TEN_MINUTES = 10 * 60 * 1000;

export const ActivitiesEntriesView = ({entries = [], isOpen = false, onClose = noop}) => {
    const filtered = useMemo(() => {
        return entries
            .filter(item => item.end > 0 && item.start > 0 && item.end - item.start > TEN_MINUTES)
            .sort((a, b) => b.end - a.end);
    }, [entries]);

    if (!isOpen) {
        return null;
    }

    console.log({filtered});

    return (
        <dialog
            onClose={onClose}
            open={true}
            onClick={(event) => event.stopPropagation()}
            className="backdrop-blur-xl fixed z-30 flex items-center bg-transparent justify-center w-full h-screen top-0">
            <div className="flex items-center justify-center flex-col gap-8 items-center font-mono justify-center h-2/3 rounded-xl pt-16">
                <div className="absolute flex gap-4 top-14">
                    <Button>
                        <X
                            size={52}
                            onClick={onClose}
                            className="dark:text-white hover:text-black"/>
                    </Button>
                </div>
                <h1 className="text-3xl dark:text-white">
                    {entries[0].id ? "Edit" : "Add"} {entries[0].name} Entr{entries.length > 1 ? "ies" : "y"}
                </h1>
                <div className="overflow-y-auto h-full flex flex-col gap-8 w-full">
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
        </dialog>
    );
};