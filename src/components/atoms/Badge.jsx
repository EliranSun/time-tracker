export const Badge = ({label, value = 0}) => {
    return (
        <span className="w-fit flex flex-col items-center justify-center gap-px">
            <span className="font-mono font-bold">{value}</span>
            <span className="text-xs">{label}</span>
        </span>
    )
}