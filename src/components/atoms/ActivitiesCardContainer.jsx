import classNames from "classnames";

export const ActivitiesCardContainer = ({children, isFit, maxHeight}) => {
    return (
        <div
            style={{maxHeight}}
            className={classNames("w-[96vw] mx-auto rounded-2xl", {
                "flex flex-col justify-start overflow-hidden": isFit,
                "overflow-y-auto": !isFit,
            })}>
            {children}
        </div>
    );
};