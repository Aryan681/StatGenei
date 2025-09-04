import React, { useEffect, useRef } from "react";
import {
  VscTable,
  VscSymbolNamespace,
  VscLayers,
  VscGraph,
  VscTypeHierarchy,
  VscRocket,
  VscFlame,
  VscPulse,
  VscServer,
} from "react-icons/vsc";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./kpi.css";
gsap.registerPlugin(ScrollTrigger);

const KpiCards = ({ kpis }) => {
  const cardsRef = useRef([]);
  cardsRef.current = [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current.length > 0) {
        // Set initial state without transition to prevent glitching
        gsap.set(cardsRef.current, { y: 50, opacity: 0 });

        gsap.fromTo(
          cardsRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: kpis.length > 1 ? 0.1 : 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current[0],
              start: "center bottom",
              toggleActions: "play none none none",
              // markers:true
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, [kpis]);

  if (!kpis || kpis.length === 0) return null;

  const kpiIcons = [
    VscTable,
    VscSymbolNamespace,
    VscLayers,
    VscGraph,
    VscTypeHierarchy,
    VscRocket,
    VscFlame,
    VscPulse,
    VscServer,
  ];

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpiIcons[index % kpiIcons.length];

        return (
          <div
            key={index}
            ref={addToRefs}
            className={`p-6 rounded-2xl shadow-md bg-gradient-to-br from-[#2d2e31] to-[#262626]
              hover:border-purple-400 hover:scale-[1.03]
              group relative overflow-hidden border border-transparent 
              ${index === kpis.length - 1 ? "sm:col-span-2" : ""}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                {kpi.name}
              </span>
              <div className="text-3xl text-purple-400 group-hover:text-white transition-colors duration-300">
                <Icon />
              </div>
            </div>

            <span
              className={`text-4xl font-extrabold block mb-2 oxanium text-white transition-colors duration-300
              group-hover:text-purple-400`}
            >
              {typeof kpi.value === "number"
                ? Number.isInteger(kpi.value)
                  ? kpi.value
                  : Math.ceil(kpi.value)
                : kpi.value}
            </span>

            <div className="flex items-center text-sm font-semibold">
              <span
                className={`mr-1 ${
                  kpi.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {kpi.change}
              </span>
              <span className="text-gray-500">{kpi.timeframe}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiCards;
