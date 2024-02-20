import classNames from "classnames";

export const Block = ({ children, className, ...rest }) => {
  return (
    <div
      className={classNames("w-full flex flex-col items-center justify-center p-4", className)}
      {...rest}>
      {children}
    </div>
  )
};