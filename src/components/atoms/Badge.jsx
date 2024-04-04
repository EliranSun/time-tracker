export const Badge = ({label, value}) => {
    return (
        <span className="w-full text-sm flex flex-col items-center justify-center gap-1">
            <i>{label}</i>
            <span className="font-mono font-bold">{value}</span>
        </span>
    )
}