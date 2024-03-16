import classNames from "classnames";

export const Toast = ({type}) => {
    return (
        <div className={classNames({
            "opacity-0": !type,
            "opacity-100": type,
            "transition-all fixed rounded flex items-center justify-center left-0 right-0": true,
            "m-auto bottom-20 bg-black text-white w-fit px-4 text-lg h-10": true,
        })}>
            {type === "success" ? "alright!" : "something got entangled"}
        </div>
    );
};