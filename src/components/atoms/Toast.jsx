import classNames from "classnames";
import {ApiStatus} from "../EditableDateTimeEntry";

export const Toast = ({type = ApiStatus.NONE }) => {
    return (
        <div className={classNames({
            "opacity-0": type === ApiStatus.NONE,
            "opacity-100": type !== ApiStatus.NONE,
            "transition-all fixed rounded flex items-center justify-center left-0 right-0": true,
            "m-auto bottom-20 bg-black text-white w-fit px-4 text-lg h-10": true,
        })}>
            {type === ApiStatus.SUCCESS ? "alright!" : "something got entangled"}
        </div>
    );
};