export const NavigationButton = ({children, ...rest}) => {
    return (
        <div
            className="bg-white dark:bg-black dark:text-white dark:border dark:border-white rounded-full m-4 p-3 shadow" {...rest}>
            {children}
        </div>
    );
};