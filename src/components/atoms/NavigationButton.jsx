import classNames from "classnames";

export const NavigationButton = ({children, className, ...rest}) => {
    return (
        <div
            className={classNames("text-black dark:text-white bg-white dark:bg-black rounded-full m-4 p-3 shadow", className)} {...rest}>
            {children}
        </div>
    );
};