import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import LeftArc from "./HalfCircle";
import "./css/preview.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Preview = () => {
  const laptopRef = useRef(null);
  const titleRef = useRef(null);
  const underlineRef = useRef(null);
  const cardRefs = useRef([]);

  const cardsData = [
    {
      title: "KPI Generation",
      summary: "See your most important metrics at a glance.",
      description: "Automatically generates key performance indicators (KPIs) from your data, like total sales or average customer value.",
      animation: { from: { x: -150, opacity: 0 }, to: { x: 0, opacity: 1, duration: 0.3, ease: "power3.out" } },
      start: "top center+=150",
    },
    {
      title: "Dynamic Visualizations",
      summary: "Explore your data with interactive charts.",
      description: "Your dashboard is populated with interactive charts, from bar graphs to scatter plots.",
      animation: { from: { y: -150, opacity: 0 }, to: { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" } },
      start: window.matchMedia("(min-width: 768px)").matches ? "top center+=150" : "top center+=190",
    },
    {
      title: "Comprehensive Data Summary",
      summary: "Get a complete overview of your dataset.",
      description: "Understand your data on a deeper level with insights into trends, missing values, and distributions.",
      animation: { from: { y: 150, opacity: 0 }, to: { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" } },
      start: "top center+=350",
    },
    {
      title: "AI-Powered Data Story",
      summary: "A narrative that explains your numbers.",
      description: "Generates a clear, business-friendly story that explains your data insights.",
      animation: { from: { x: 150, opacity: 0 }, to: { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" } },
      start: "top center+=350",
    },
  ];

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const ctx = gsap.context(() => {
      // Title Animation
      if (titleRef.current) {
        const splitTitle = new SplitText(titleRef.current, { type: "chars" });
        gsap.fromTo(
          splitTitle.chars,
          { x: 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.05,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top center+=150",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // Underline Animation
      if (underlineRef.current) {
        gsap.fromTo(
          underlineRef.current,
          { scaleX: 0, transformOrigin: "left" },
          { scaleX: 1, duration: 0.5, ease: "power2.out" }
        );
      }

      // Laptop Animation
      if (laptopRef.current) {
        gsap.fromTo(
          laptopRef.current,
          { x: -200, y: -400, opacity: 0, rotation: -30 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: laptopRef.current,
              start: isDesktop ? "top center-=60" : "top+=90% center",
              end: isDesktop ? "bottom 25%" : "bottom+=70% 25%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // Cards Animation
      cardsData.forEach((card, i) => {
        if (cardRefs.current[i]) {
          gsap.fromTo(
            cardRefs.current[i],
            card.animation.from,
            {
              ...card.animation.to,
              scrollTrigger: {
                trigger: cardRefs.current[i],
                start: card.start,
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="dashboard" className="min-h-screen flex flex-col justify-center px-8 py-10 text-black">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <LeftArc />
        <div ref={laptopRef} className="relative lg:left-[-10rem] w-full aspect-video">
          <img
            src="./pngwing.com.png"
            alt="Laptop frame illustration"
            className="w-full h-auto"
            loading="lazy"
          />
          <div className="absolute top-[5%] left-[12%] w-[76%] h-[80%] overflow-y-scroll hide-scrollbar">
            <img
              src="./dashh-scroll.png"
              alt="Dashboard scroll preview"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex ml-2 lg:ml-14 flex-col h-full justify-start">
          <h2 ref={titleRef} className="text-5xl lg:text-7xl mozilla-headline font-bold mb-1">
            Dashboard
          </h2>
          <div ref={underlineRef} className="w-full h-[2px] bg-black mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-12">
            {cardsData.map((card, i) => (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                className={`group p-4 transition-all duration-300 transform hover:scale-105 border-gray-300 ${i % 2 !== 0 ? 'border-l' : ''} ${i > 1 ? 'border-t' : ''}`}
              >
                <h3 className="text-xl font-bold mb-2 group-hover:text-black transition-colors">{card.title}</h3>
                <p className="text-sm font-medium text-gray-600 mb-3 group-hover:text-gray-700 transition-colors">{card.summary}</p>
                <p className="text-gray-500 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
