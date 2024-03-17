export const Button = ({children}) => {
    return (
        <span className="rounded-full border-4 border-black dark:border-white p-4 hover:bg-white hover:text-black">
            {children}
        </span>
    );
};