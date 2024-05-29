import classNames from "classnames";

const Size = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
};

const Unit = {
    NONE: '',
    DAY: 'd',
    HOUR: 'h',
};

const Badge = ({label, value, size = Size.SMALL, unit = Unit.DAY}) => {
    return (
        <span className="w-full flex flex-col items-center justify-center gap-px">
            <span className={classNames({
                "font-mono font-bold": true,
                "text-2xl": size === Size.SMALL,
                "text-3xl": size === Size.MEDIUM,
                "text-4xl": size === Size.LARGE,
            })}>{value}{unit}</span>
            <span className="text-xs">{label}</span>
        </span>
    )
}

Badge.Size = Size;
Badge.Unit = Unit;

export {Badge};