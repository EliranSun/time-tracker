export const EmptyView = ({isPast}) => {
    return (
        <div className="flex items-center h-full font-mono px-4 text-3xl">
            {isPast
                ? (
                    <p>
                        It is gone - but not forgotten... <br/><br/>
                        It is a part of you now, <br/> carved as your present.
                    </p>
                )
                : (
                    <p>
                        Filled with possibilities and potential... <br/><br/>
                        Their only masters, <br/> are you and time.
                    </p>
                )}
        </div>
    );
}