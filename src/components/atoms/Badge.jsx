import classNames from "classnames";

const Size = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
};

const Badge = ({label, value, size = Size.SMALL}) => {
    return (
        <span className="w-full flex flex-col items-center justify-center gap-px">
            <span className={classNames({
                "font-mono font-bold": true,
                "text-2xl": size === Size.SMALL,
                "text-3xl": size === Size.MEDIUM,
                "text-4xl": size === Size.LARGE,
            })}>{value}</span>
            <span className="text-xs">{label}</span>
        </span>
    )
}

Badge.Size = Size;

export {Badge};