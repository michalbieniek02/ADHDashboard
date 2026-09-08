import { useEffect, useState } from "react";

type ClockProps = {
  timeZone: string;
  label: string;
};

function Clock({ timeZone, label }: ClockProps) {
  const getTime = () =>
    new Date().toLocaleTimeString("pl-PL", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const [time, setTime] = useState(getTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [timeZone]);

  return (
    <div className="clock">
      <span className="clock-label">{label}</span>
      <span className="clock-time">{time}</span>
    </div>
  );
}

export default Clock;