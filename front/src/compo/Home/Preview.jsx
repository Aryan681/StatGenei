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

  // Refs for the four feature blocks
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  const animateCard = (ref, animation) => {
    if (ref.current) {
      gsap.fromTo(ref.current, animation.from || {}, {
        ...animation.to,
        scrollTrigger: {
          trigger: ref.current,
          start: animation.start || "top 90%",
          end: animation.end || "bottom center",
          toggleActions: animation.toggle || "play reverse play reverse",
          markers: animation.markers || false,
        },
      });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline for the title and underline
      const titleTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top center+=150",
          end: "bottom 10%",
          toggleActions: "play reverse play reverse",
          // markers: true,
        },
      });

      if (titleRef.current) {
        const mySplitText = new SplitText(titleRef.current, { type: "chars" });

        // Add the SplitText animation to the timeline
        titleTimeline.fromTo(
          mySplitText.chars,
          { x: 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.05,
            reverseEase: "power2.in",
            reverseDuration: 1,
            // marker:true
          }
        );
      }

      if (underlineRef.current) {
        // Add the underline animation to the timeline
        // It will start after the text animation is complete
        titleTimeline.fromTo(
          underlineRef.current,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            duration: 0.5,
            ease: "power2.out",
          }
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
            reverseEase: "power4.in",
            reverseDuration: 0.8,
            scrollTrigger: {
              trigger: laptopRef.current,
              start: isDesktop ? "top center-=60" : "top+=90% center",
              end: isDesktop ? "bottom 25%" : "bottom+=70% 25%",
              toggleActions: "play reverse play reverse",
              // markers: true,
            },
          }
        );
      }

      // Card Animations
      animateCard(card1Ref, {
        from: { x: -150, opacity: 0 },
        to: { x: 0, opacity: 1, duration: 0.3, ease: "power3.out" },
        start: "top center+=150",
        end: "bottom 30%",
      });

      animateCard(card2Ref, {
        from: { y: -150, opacity: 0 },
        to: { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
        start: isDesktop ?"top center+=150":"top center+=190",
        end: isDesktop ? "bottom 30%" : "bottom 40%",
        // markers: true,
      });

      animateCard(card3Ref, {
        from: { y: 150, opacity: 0 },
        to: { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
        start: "top center+=350",
        end: isDesktop ? "bottom 60%" : "bottom 50%",
        // markers: true,
      });

      animateCard(card4Ref, {
        from: { x: 150, opacity: 0 },
        to: { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
        start: "top center+=350",
        end: "bottom 60%",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="dashboard"
      className="min-h-screen flex flex-col justify-center px-8 py-10 text-white"
    >
      <div className="max-w-7xl mx-2 lg:mx-13   w-full grid grid-cols-1 md:grid-cols-2  gap-12 items-center">
        {/* Left Column: Dashboard Preview */}
        <LeftArc />
        <div ref={laptopRef} className="relative w-full aspect-video">
          <img
            src="./pngwing.com.png"
            alt="Laptop Frame"
            className="w-full h-auto"
          />
          <div className="absolute top-[5%] left-[12%] w-[76%] h-[80%] overflow-y-scroll hide-scrollbar">
            <img
              src="./dashh-scroll.png"
              alt="Dashboard Preview"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right Column: Caption and Feature Blocks */}
        <div className="flex ml-2 lg:ml-14 flex-col h-full justify-start">
          <h2
            ref={titleRef}
            className="text-5xl  lg:text-7xl mozilla-headline font-bold mb-1 text-black"
          >
            Dashboard
          </h2>
          {/* Underline element */}
          <div ref={underlineRef} className="w-full h-[2px] bg-black" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-5 gap-x-12 gap-y-12">
            <div
              ref={card1Ref}
              className="group p-4 transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-black transition-colors">
                KPI Generation
              </h3>
              <p className="text-sm font-medium text-gray-600 mb-3 group-hover:text-gray-700 transition-colors">
                See your most important metrics at a glance.
              </p>
              <p className="text-gray-500 text-sm">
                Our tool automatically generates key performance indicators
                (KPIs) from your data, such as total sales or average customer
                value.
              </p>
            </div>
            <div
              ref={card2Ref}
              className="group p-4 border-l border-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-black transition-colors">
                Dynamic Visualizations
              </h3>
              <p className="text-sm font-medium text-gray-600 mb-3 group-hover:text-gray-700 transition-colors">
                Explore your data with interactive charts.
              </p>
              <p className="text-gray-500 text-sm">
                No more static reports. Your dashboard is populated with a
                gallery of interactive charts, from bar graphs to scatter plots.
              </p>
            </div>
            <div
              ref={card3Ref}
              className="group p-4 border-t border-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-black transition-colors">
                Comprehensive Data Summary
              </h3>
              <p className="text-sm font-medium text-gray-600 mb-3 group-hover:text-gray-700 transition-colors">
                Get a complete overview of your dataset.
              </p>
              <p className="text-gray-500 text-sm">
                Understand your data on a deeper level.
              </p>
            </div>
            <div
              ref={card4Ref}
              className="group p-4 border-l border-t border-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-black transition-colors">
                AI-Powered Data Story
              </h3>
              <p className="text-sm font-medium text-gray-600 mb-3 group-hover:text-gray-700 transition-colors">
                A narrative that explains your numbers.
              </p>
              <p className="text-gray-500 text-sm">
                Our AI goes beyond simple charts to generate a clear,
                business-friendly story about your data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
