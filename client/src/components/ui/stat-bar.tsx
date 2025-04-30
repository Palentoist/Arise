interface StatBarProps {
  value: number;
  maxValue?: number;
  className?: string;
}

export default function StatBar({ value, maxValue = 100, className }: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  return (
    <div className="stats-bar">
      <div 
        className="stats-fill" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
