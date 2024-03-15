import { noop } from "lodash";
import { X, Check } from "@phosphor-icons/react";
import { EditableDateTimeEntry } from "../EditableDateTimeEntry";

const ModalButton = ({children}) => {
    return (
         <span className="rounded-full border-4 border-black dark:border-white p-4 hover:bg-white hover:text-black">
            {children}
        </span>
    );
};

export const EditActivityEntryModal = ({ entry, isOpen = false, onClose = noop }) => {
    if (!isOpen)
        return null;
        
    return (
        <dialog
                    onClose={onClose}
                    open={true}
                    className="backdrop-blur-xl fixed z-30 flex items-center bg-transparent justify-center w-screen h-screen top-0">
                    <div className="flex flex-col items-center font-mono justify-center w-5/6 h-2/3 rounded-xl p-8 pt-16">
                        <div className="absolute top-14">
                        <ModalButton>
                            <X
                                size={52}
                                onClick={onClose}
                                className="dark:text-white hover:text-black"/>
                        </ModalButton>
                         {!entry.id ? 
                        <ModalButton>
                           <Check
                                size={52}
                                onClick={onClose}
                                className="dark:text-white hover:text-black"/> 
                        </ModalButton>: null}
                        </div>
                        <h1>{entry.name}</h1>
                        <EditableDateTimeEntry
                            id={entry.id}
                            activityName={entry.name}
                            start={entry.start}
                            end={entry.end}/>
                    </div>
                </dialog>
        );
};