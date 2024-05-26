export const NavbarStyle = ({children}) => {
    return (
        <div
            className="absolute w-fit z-10 inset-x-0 m-auto bottom-6 flex items-center justify-center border-t border-gray-300/50 gap-10 py-4 px-8">
            {children}
        </div>
    );
};