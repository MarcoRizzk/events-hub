export default function Spinner({
  size = 20,
  color = "border-white",
  borderClass = "border-b-2",
}: {
  size?: number;
  color?: string;
  borderClass?: string;
}) {
  return (
    <div
      className={`animate-spin rounded-full ${borderClass} ${color}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}
