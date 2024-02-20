export const DateInput = ({ name }) => {
  const MaxValues = {
    "date-day": 31,
    "date-month": 12,
    "date-year": 99,
    "date-hours": 24,
    "date-minutes": 59
  };
  const now = new Date();
  const DefaultValues = {
    "date-day": now.getDate(),
    "date-month": now.getMonth() + 1,
    "date-year": now.getFullYear().toString().slice(-2),
    "date-hours": now.getHours(),
    "date-minutes": now.getMinutes()
  };
  
  return (
    <input
      name={name}
      className="w-5 bg-transparent"
      type="number"
      placeholder="00"
      defaultValue={DefaultValues[name]}
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
        
        if (value > MaxValues["date-day"]) {
          event.target.value = MaxValues["date-day"];
        }
      }}/>
  );
  
}