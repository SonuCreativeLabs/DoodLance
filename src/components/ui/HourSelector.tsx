import React, { useRef, useEffect } from "react";

interface HourSelectorProps {
  value: string;
  onChange: (val: string) => void;
  disabledHours?: string[];
  label?: string;
}

// Generates an array of hour strings in 12-hour format from 12 AM to 11 AM and 12 PM to 11 PM
function getHourOptions() {
  const hours = [];
  for (let h = 0; h < 24; h++) {
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? "AM" : "PM";
    hours.push(`${hour12.toString().padStart(2, "0")} ${ampm}`);
  }
  return hours;
}

const HourSelector: React.FC<HourSelectorProps> = ({
  value,
  onChange,
  disabledHours = [],
  label
}) => {
  const baseHours = getHourOptions();
  // Repeat the hours 3 times for infinite scroll illusion
  const hours = [...baseHours, ...baseHours, ...baseHours];
  const middleStart = baseHours.length;

  const listRef = useRef<HTMLDivElement>(null);

  // Find the index of the currently selected hour (prefer the middle set)
  let selectedIdx = hours.indexOf(value, middleStart);
  if (selectedIdx === -1) selectedIdx = hours.indexOf(value);

  // Auto-scroll to the selected hour (centered)
  useEffect(() => {
    if (listRef.current && selectedIdx >= 0) {
      // Scroll so the selected item is centered, but only if not already in view
      const container = listRef.current;
      const btn = container.children[selectedIdx] as HTMLElement;
      if (btn) {
        const containerRect = container.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        // Check if the button is out of view (above or below)
        if (btnRect.top < containerRect.top || btnRect.bottom > containerRect.bottom) {
          btn.scrollIntoView({ block: "center", behavior: "auto" });
        }
      }
    }
  }, [value, hours, selectedIdx]);

  // Infinite scroll: if near top/bottom, jump to middle
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const onScroll = () => {
      const children = Array.from(container.children);
      if (children.length === 0) return;
      const scrollTop = container.scrollTop;
      const itemHeight = (children[0] as HTMLElement).offsetHeight;
      const totalHeight = itemHeight * hours.length;
      // const visibleCount = Math.floor(container.offsetHeight / itemHeight); // Unused
      // If scrolled near top, jump to middle
      if (scrollTop < itemHeight * 2) {
        container.scrollTop = scrollTop + baseHours.length * itemHeight;
      }
      // If scrolled near bottom, jump to middle
      else if (scrollTop > totalHeight - container.offsetHeight - itemHeight * 2) {
        container.scrollTop = scrollTop - baseHours.length * itemHeight;
      }
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    // On mount, scroll to the middle set
    setTimeout(() => {
      if (container.children[selectedIdx]) {
        (container.children[selectedIdx] as HTMLElement).scrollIntoView({ block: "center", behavior: "auto" });
      }
    }, 0);
    return () => container.removeEventListener("scroll", onScroll);
  }, [hours, selectedIdx, baseHours.length]);

  // Auto-select the hour in the center as user scrolls
  useEffect(() => {
    if (!listRef.current) return;
    const container = listRef.current;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          let minDist = Infinity;
          let idx = -1;
          Array.from(container.children).forEach((child, i) => {
            const childRect = (child as HTMLElement).getBoundingClientRect();
            const center = childRect.top + childRect.height / 2;
            const dist = Math.abs(center - (rect.top + rect.height / 2));
            if (dist < minDist) {
              minDist = dist;
              idx = i;
            }
          });
          // Only allow selecting from the middle set
          if (idx >= middleStart && idx < middleStart + baseHours.length && baseHours.includes(hours[idx])) {
            if (hours[idx] !== value && !disabledHours.includes(hours[idx])) {
              onChange(hours[idx]);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [hours, value, onChange, disabledHours, baseHours.length, middleStart]);

  return (
    <div className="w-full">
      {label && <div className="mb-2 text-neutral-700 text-sm font-medium">{label}</div>}
      <div
        ref={listRef}
        className="relative flex flex-col items-center justify-center h-[140px] overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        tabIndex={0}
        style={{scrollbarWidth: 'none'}}
      >
        {/* Highlight tab overlay for centered hour */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10 flex justify-center">
          <div className="w-28 h-12 rounded-full bg-purple-100/60 border-2 border-purple-400 shadow-lg" />
        </div>
        {hours.map((h, idx) => {
          const isSelected = value === h && idx >= middleStart && idx < middleStart + baseHours.length;
          const isDisabled = disabledHours.includes(h);
          return (
            <button
              key={h + '-' + idx}
              type="button"
              className={`w-24 mx-auto my-1 rounded-full text-base font-semibold transition-all snap-center relative z-20
                ${isSelected ? "bg-purple-600 text-white scale-110 shadow" : "bg-gray-100 text-gray-400 scale-95"}
                ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-purple-100 hover:text-purple-700"}`}
              disabled={isDisabled}
              style={{ minHeight: 40 }}
              onClick={() => !isDisabled && onChange(h)}
            >
              {h}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HourSelector;
