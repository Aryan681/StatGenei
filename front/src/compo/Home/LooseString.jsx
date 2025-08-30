import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LooseString() {
  const pathRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      const y = e.clientY - rect.top;

      const midY = rect.height / 2;
      const distY = y - midY;

      // make it more "loose" → higher multiplier
      const controlPointX = rect.width / 2;
      const controlPointY = midY + distY * 1.6;

      const newPath = `M 0 ${midY} Q ${controlPointX} ${controlPointY}, ${rect.width} ${midY}`;

      gsap.to(path, {
        attr: { d: newPath },
        duration: 0.25,
        ease: "power3.out",
      });
    };

    const resetString = () => {
      const rect = container.getBoundingClientRect();
      const midY = rect.height / 2;
      const controlPointX = rect.width / 2;
      const controlPointY = midY;

      const defaultPath = `M 0 ${midY} Q ${controlPointX} ${controlPointY}, ${rect.width} ${midY}`;

      gsap.to(path, {
        attr: { d: defaultPath },
        duration: 1,
        ease: "elastic.out(1, 0.4)", // looser bounce back
      });
    };

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", resetString);

    resetString();

    return () => {
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", resetString);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-48 flex items-center justify-center bg-white"
    >
      <svg width="95%" height="100%">
        <path
          ref={pathRef}
          stroke="black"
          strokeWidth="3"
          fill="transparent"
        />
      </svg>
    </div>
  );
}
