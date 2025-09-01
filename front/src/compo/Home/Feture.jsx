import React, { useEffect, useRef, forwardRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./css/Feature.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Feature = forwardRef((props, ref) => {
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  const featureRefs = useRef([]);
  const cardRefs = useRef([]);

  const cardsData = [
    {
      image: "./data-management.png",
      alt: "Icon representing data management and organization",
      shadowClass: "shadow-[-25px_-25px_50px_#aaaaaa,_25px_25px_50px_#ffffff]",
      animation: { x: -150 },
    },
    {
      image: "./graph.png",
      alt: "Icon of a financial or trend graph",
      shadowClass: "shadow-[25px_-25px_50px_#aaaaaa,_-25px_25px_50px_#ffffff]",
      animation: { y: -150 },
    },
    {
      image: "./line-chart.png",
      alt: "Icon of a line chart showing a rising trend",
      shadowClass: "shadow-[-25px_25px_50px_#aaaaaa,_25px_-25px_50px_#ffffff]",
      animation: { y: 150 },
    },
    {
      image: "./statistics.png",
      alt: "Icon representing statistics and data analysis",
      shadowClass: "shadow-[25px_25px_50px_#aaaaaa,_-25px_-25px_50px_#ffffff]",
      animation: { x: 150 },
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate main title
      if (titleRef.current) {
        const mySplitText = new SplitText(titleRef.current, { type: "chars" });
        gsap.fromTo(
          mySplitText.chars,
          { y: -100, opacity: 0 },
          {
            y: 0,
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

      // Animate cards
      const cleanups = [];
      cardsData.forEach((card, i) => {
        const cardElement = cardRefs.current[i];
        if (cardElement) {
          // Scroll animation
          gsap.from(cardElement, {
            ...card.animation,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardElement,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
              // markers:true
            },
          });

          // Hover animation
          const allCards = cardRefs.current;
          const otherCards = allCards.filter((_, j) => j !== i);

          const onMouseEnter = () => {
            gsap.to(cardElement, { scale: 1.1, duration: 0.3, ease: "power2.out" });
            gsap.to(otherCards, { scale: 0.9, duration: 0.3, ease: "power2.out" });
          };
          const onMouseLeave = () => {
            gsap.to(allCards, { scale: 1, duration: 0.3, ease: "power2.out" });
          };

          cardElement.addEventListener("mouseenter", onMouseEnter);
          cardElement.addEventListener("mouseleave", onMouseLeave);

          cleanups.push(() => {
            cardElement.removeEventListener("mouseenter", onMouseEnter);
            cardElement.removeEventListener("mouseleave", onMouseLeave);
          });
        }
      });

      // Animate feature text items
      gsap.from(featureRefs.current, {
        x: 200,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featureRefs.current[0],
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      });

      // Animate button
      if (buttonRef.current) {
        gsap.from(buttonRef.current, {
          y: 100,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "bottom-=60 bottom-=50",
            end: "top center",
            toggleActions: "play reverse play reverse",
          },
        });
      }

      return () => cleanups.forEach((fn) => fn());
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="features"
      className="min-h-screen m-3 flex flex-col justify-start px-4 sm:px-6 lg:px-12 py-12 sm:py-16 text-black"
    >
      <h2
        ref={titleRef}
        className="merriweather mt-13 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-center md:text-left mb-10 md:mb-16"
      >
        Features
      </h2>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
        {/* Left: Cards */}
        <div className="grid grid-cols-2 grid-rows-2 gap-1 max-h-[70vh]">
          {cardsData.map((card, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className={`aspect-square max-h-[30vh] rounded-xl flex items-center justify-center p-2 sm:p-4 ${card.shadowClass}`}
            >
              <img
                src={card.image}
                alt={card.alt}
                className="w-full max-h-[20vh] object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Right: Feature Text */}
        <div className="flex flex-col mt-10 lg:mt-0 lg:ml-12 xl:ml-24">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
            AI-Powered Data Analysis
          </p>
          <div className="space-y-6">
            {["KPI Generation", "Dynamic Visualizations", "Comprehensive Summaries", "Intelligent Data Storytelling"].map(
              (title, i) => (
                <div key={i} ref={(el) => (featureRefs.current[i] = el)}>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">{title}</h3>
                  <p className="text-base sm:text-lg text-gray-600">
                    {[
                      "Automatically calculates and formats key metrics like sums, averages, and min/max values from your data.",
                      "Creates a wide variety of relevant charts, from bar and pie charts to line graphs and correlation heatmaps.",
                      "Provides detailed summaries of numeric and categorical data, including missing values and unique counts.",
                      "Generates a concise, business-friendly narrative that highlights key findings and cleaning report details.",
                    ][i]}
                  </p>
                </div>
              )
            )}
          </div>

          <button
            ref={buttonRef}
            className="mt-8 bg-black text-white font-semibold rounded-xl h-10 w-28 sm:w-32 hover:bg-gray-800 transition"
          >
            Explore
          </button>
        </div>
      </div>
    </section>
  );
});

export default Feature;
