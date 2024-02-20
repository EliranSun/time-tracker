export const TimeInput = ({ name }) => {
  return (
    <input
      name={name}
      className="w-20 bg-transparent"
      type="number"
      placeholder="00"
      onFocus={(event) => event.target.select()}
      onChange={(event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        if (String(value).length >= 2) {
          // focus on the next input
          if (event.target.nextElementSibling) {
            event.target.nextElementSibling.focus();
          } else {
            event.target.blur();
          }
        }
        
        if (name === "time-hours" && value > 24) {
          event.target.value = 24;
        }
        
        if (name === "time-minutes" && value > 59) {
          event.target.value = 59;
        }
        
        if (name === "time-seconds" && value > 59) {
          event.target.value = 59;
        }
      }}/>
  );
};