export type TimeRange = "Day" | "Week" | "Month" | "Year";

interface Props {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  options?: TimeRange[];
}

export default function TimeRangeToggle({
  value,
  onChange,
  options = ["Day", "Week", "Month", "Year"],
}: Props) {
  return (
    <div className="tabs">
      {options.map((option) => (
        <button
          key={option}
          className={value === option ? "selected" : ""}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
