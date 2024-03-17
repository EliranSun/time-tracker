import {noop} from "lodash";
import {X} from "@phosphor-icons/react";
import {EditableDateTimeEntry} from "../EditableDateTimeEntry";
import {Button} from "../atoms/Button";

export const ActivitiesEntriesView = ({entry, isOpen = false, onClose = noop}) => {
    if (!isOpen)
        return null;

    return (
        <dialog
            onClose={onClose}
            open={true}
            className="backdrop-blur-xl fixed z-30 flex items-center bg-transparent justify-center w-screen h-screen top-0">
            <div className="flex items-center justify-center flex-col gap-8 items-center font-mono justify-center w-5/6 h-2/3 rounded-xl p-8 pt-16">
                <div className="absolute flex gap-4 top-14">
                    <Button>
                        <X
                            size={52}
                            onClick={onClose}
                            className="dark:text-white hover:text-black"/>
                    </Button>
                </div>
                <h1 className="text-3xl">{entry.id ? "Edit" : "Add"} {entry.name} Entry</h1>
                <EditableDateTimeEntry
                    id={entry.id}
                    isListView={true}
                    activityName={entry.name}
                    start={entry.start}
                    end={entry.end}/>
            </div>
        </dialog>
    );
};