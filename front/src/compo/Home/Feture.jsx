import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Feature = () => {
  const titleRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);
  const title2Refs = useRef(null);
  const buttonRef = useRef(null);
  const featureRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const cardRefs = [card1Ref, card2Ref, card3Ref, card4Ref];

  const cardsData = [
    {
      image: "./data-management.png",
      shadowClass: "shadow-[-25px_-25px_50px_#aaaaaa,_25px_25px_50px_#ffffff]",
    },
    {
      image: "./graph.png",
      shadowClass: "shadow-[25px_-25px_50px_#aaaaaa,_-25px_25px_50px_#ffffff]",
    },
    {
      image: "./line-chart.png",
      shadowClass: "shadow-[-25px_25px_50px_#aaaaaa,_25px_-25px_50px_#ffffff]",
    },
    {
      image: "./statistics.png",
      shadowClass: "shadow-[25px_25px_50px_#aaaaaa,_-25px_-25px_50px_#ffffff]",
    },
  ];

  useEffect(() => {
    // GSAP Context for cleanup
    const ctx = gsap.context(() => {
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
            reverseEase: "power2.in",
            reverseDuration: 1,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top center+=150",
              end: "bottom 10%",
              toggleActions: "play reverse play reverse",
              // markers: true,
            },
          }
        );
      }

      // Card Animations
      gsap.from(card1Ref.current, {
        x: -150,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card1Ref.current,
          start: "top 80%",
          toggleActions: "play reverse play reverse",
          // markers: true
        },
      });

      gsap.from(card2Ref.current, {
        y: -150,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card2Ref.current,
          start: "top 70%",
          toggleActions: "play reverse play reverse",
          // markers: true
        },
      });

      gsap.from(card3Ref.current, {
        y: 150,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card3Ref.current,
          start: "top 90%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.from(card4Ref.current, {
        x: 150,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card4Ref.current,
          start: "top 90%",
          toggleActions: "play reverse play reverse",
          // markers: true
        },
      });
      gsap.from(title2Refs.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title2Refs.current,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      });
      
      gsap.from(
        featureRefs.map((ref) => ref.current),
        {
          x: 200,
          opacity: 0,
          duration: 1,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featureRefs[0].current,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.from(buttonRef.current, {
        y: 100,
        opacity: 0,
        duration: .3,
        ease: "power2.out", // Corrected: Added a valid ease mode
        scrollTrigger: {
          trigger: buttonRef.current,
          start: "top 98%", // Corrected: A more common and reliable start position
          toggleActions: "play reverse play reverse",
          // markers:true
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
  <section
  id="features"
  className="min-h-screen m-3 flex flex-col justify-start px-4 sm:px-6 lg:px-12 py-12 sm:py-16 text-black"
>
  <h2
    ref={titleRef}
    className="merriweather text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-center md:text-left mb-10 md:mb-16"
  >
    Features
  </h2>

  <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
    {/* Left: Cards */}
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      {cardsData.map((card, i) => (
        <div
          key={i}
          ref={cardRefs[i]}
          className={`aspect-square rounded-xl flex items-center justify-center p-2 sm:p-4 ${card.shadowClass}`}
        >
          <img
            src={card.image}
            alt={`Feature ${i + 1}`}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>

    {/* Right: Text */}
    <div className="flex flex-col mt-10 lg:mt-0 lg:ml-12 xl:ml-24">
      <p
        className="text-xl sm:text-2xl md:text-3xl font-bold mb-6"
        ref={title2Refs}
      >
        AI-Powered Data Analysis
      </p>

      <div className="space-y-6">
        <div ref={featureRefs[0]}>
          <h3 className="text-lg sm:text-xl font-bold mb-1">KPI Generation</h3>
          <p className="text-base sm:text-lg text-gray-600">
            Automatically calculates and formats key metrics like sums,
            averages, and min/max values from your data.
          </p>
        </div>

        <div ref={featureRefs[1]}>
          <h3 className="text-lg sm:text-xl font-bold mb-1">
            Dynamic Visualizations
          </h3>
          <p className="text-base sm:text-lg text-gray-600">
            Creates a wide variety of relevant charts, from bar and pie charts
            to line graphs and correlation heatmaps.
          </p>
        </div>

        <div ref={featureRefs[2]}>
          <h3 className="text-lg sm:text-xl font-bold mb-1">
            Comprehensive Summaries
          </h3>
          <p className="text-base sm:text-lg text-gray-600">
            Provides detailed summaries of numeric and categorical data,
            including missing values and unique counts.
          </p>
        </div>

        <div ref={featureRefs[3]}>
          <h3 className="text-lg sm:text-xl font-bold mb-1">
            Intelligent Data Storytelling
          </h3>
          <p className="text-base sm:text-lg text-gray-600">
            Generates a concise, business-friendly narrative that highlights
            key findings and cleaning report details.
          </p>
        </div>
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
};

export default Feature;
