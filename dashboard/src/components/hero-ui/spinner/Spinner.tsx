import { useEffect, useState } from "react";
import { Spinner, Slider } from "@heroui/react";

interface SpinnerUiProps {
  duration?: number; 
  onFinish?: () => void;
  
}

const SpinnerUi = ({ duration = 3000, onFinish }: SpinnerUiProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);

      if (elapsed >= duration) {
        clearInterval(interval);
        onFinish?.(); // optional callback when finished
      }
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onFinish]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <Spinner variant="gradient" size="sm" color="primary" />
      <Slider
        aria-label="Loading progress"
        className="w-40"
        color="foreground"
        value={progress}
        hideThumb={true}
        maxValue={100}
        minValue={0}
        isDisabled
        size="sm"
      />
    </div>
  );
};

export default SpinnerUi;
