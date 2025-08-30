import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LooseStringVariant() {
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

      // exaggerate looseness
      const cp1X = rect.width / 3;
      const cp1Y = midY + distY * 2.2; // left wave more loose
      const cp2X = (2 * rect.width) / 3;
      const cp2Y = midY - distY * 2.2; // right wave more loose

      const newPath = `M 0 ${midY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${rect.width} ${midY}`;

      gsap.to(path, {
        attr: { d: newPath },
        duration: 0.35, // slower response
        ease: "power3.out",
      });
    };

    const resetString = () => {
      const rect = container.getBoundingClientRect();
      const midY = rect.height / 2;

      const cp1X = rect.width / 3;
      const cp1Y = midY;
      const cp2X = (2 * rect.width) / 3;
      const cp2Y = midY;

      const defaultPath = `M 0 ${midY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${rect.width} ${midY}`;

      gsap.to(path, {
        attr: { d: defaultPath },
        duration: 1.4, // slower return
        ease: "elastic.out(1, 0.8)", // extra wobbly
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
