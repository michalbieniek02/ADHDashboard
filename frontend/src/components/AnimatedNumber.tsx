import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  duration?: number;
};

function AnimatedNumber({
  value,
  duration = 200,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // smooth easing
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(value * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <>
      {Math.round(displayValue).toLocaleString("pl-PL")}
    </>
  );
}

export default AnimatedNumber;