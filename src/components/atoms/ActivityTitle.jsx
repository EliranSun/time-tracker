import classNames from "classnames";

export const ActivityTitle = ({name, isZenMode}) => {
    return (
        <h1
            className={classNames("break-words w-96 font-mono text-center overflow-hidden", {
                "tracking-[-5px] font-extrabold h-full text-7xl mb-10": isZenMode,
                "tracking-[-14px] -ml-2 leading-tight font-thin h-fit text-8xl": !isZenMode
            })}>
            {name.toUpperCase()}
        </h1>
    )
}