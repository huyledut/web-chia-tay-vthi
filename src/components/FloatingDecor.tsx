const ITEMS = ["🍃", "🌿", "☁️", "🏡", "✈️", "🦋"];

export function FloatingDecor() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {ITEMS.map((item, i) => (
        <span
          key={item + i}
          className="drift absolute text-2xl"
          style={{
            left: `${8 + i * 16}%`,
            bottom: "-10%",
            animationDuration: `${14 + i * 3}s`,
            animationDelay: `${i * 1.4}s`,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
