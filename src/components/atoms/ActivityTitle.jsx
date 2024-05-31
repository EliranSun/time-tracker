import classNames from "classnames";

export const ActivityTitle = ({name, isZenMode}) => {
    const actionBasedTitle = name
        .replace("ive", "e")
        .replace("ing", "");

    return (
        <h1
            className={classNames("break-words w-fit font-mono text-center overflow-hidden h-fit", {
                "tracking-[-14px] pr-4 -ml-2 leading-tight font-thin text-8xl": !isZenMode,
                "tracking-[-5px] font-extrabold h-full text-7xl": isZenMode,
            })}>
            {actionBasedTitle.slice(0, 6).toUpperCase()}
        </h1>
    )
}