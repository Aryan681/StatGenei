import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./css/Hero.css";
import ParticleBackground from "./Particle";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Hero = () => {
  const heading1Ref = useRef(null);
  const heading2Ref = useRef(null);
  const heading3Ref = useRef(null);
  const ImageRef = useRef(null);
  const svgRef = useRef(null);
  const svg2Ref = useRef(null);

  useEffect(() => {
    // Media query to check for desktop screens
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const triggerStart = isDesktop ? "top 80%" : "top 95%";

    if (heading1Ref.current) {
      const mySplitText = new SplitText(heading1Ref.current, {
        type: "chars",
      });

      gsap.fromTo(
        mySplitText.chars,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading1Ref.current,
            start: triggerStart,
            toggleActions: "play reverse play reverse ",
          },
        }
      );
    }
    if (heading2Ref.current) {
      const mySplitText = new SplitText(heading2Ref.current, { type: "chars" });

      mySplitText.chars.forEach((char) => {
        char.style.backgroundImage =
          "linear-gradient(to right, #a855f7, #4f46e5)";
        char.style.webkitBackgroundClip = "text";
        char.style.backgroundClip = "text";
        char.style.color = "transparent";
      });

      gsap.fromTo(
        mySplitText.chars,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading2Ref.current,
            start: triggerStart,
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }
    if (heading3Ref.current) {
      const mySplitText = new SplitText(heading3Ref.current, {
        type: "chars",
      });

      gsap.fromTo(
        mySplitText.chars,
        {
          y: -20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading3Ref.current,
            start: triggerStart,
            toggleActions: "play reverse play reverse ",
          },
        }
      );
    }
    if (ImageRef.current) {
      gsap.fromTo(
        ImageRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 1.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ImageRef.current,
            start: isDesktop ? "top 80%" : "top-=30 45%",
            end:  isDesktop ?"top center-=30":"top+=80 center-=30",
            toggleActions: "play reverse play reverse ",
            // markers: true,
          },
        }
      );
    }

    // Animation for the SVG arrows
    const arrowAnimationOffset = isDesktop ? 200 : 100;
    if (svgRef.current) {
      gsap.fromTo(
        svgRef.current,
        {
          x: arrowAnimationOffset,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading1Ref.current,
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }
    if (svg2Ref.current) {
      gsap.fromTo(
        svg2Ref.current,
        {
          x: -arrowAnimationOffset,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading1Ref.current,
            start: "top 70%",
            toggleActions: "play reverse play reverse",
            // markers: true,
          },
        }
      );
    }
  }, []);

  return (
    <section className="h-full lg:h-screen   flex flex-col justify-center items-center px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-[#0F0E0E] z-0"></div>
      {/* <ParticleBackground /> */}

      <div
        ref={svgRef}
        className="absolute   right-[-78px] lg:right-25 top-65 lg:top-95 -translate-y-1/2 z-10 w-[8rem] h-[18rem] md:w-[10rem] md:h-[20rem]"
      >
        <img
          src="/arro.png"
          alt=""
          className="h-full w-full  opacity-0 lg:opacity-100 rotate-180 scale-x-[1.5]"
        />
      </div>
      <div
        ref={svg2Ref}
        className="absolute left-[-78px] lg:left-20 top-65 lg:top-95 -translate-y-1/2 z-10 w-[8rem] h-[18rem] md:w-[10rem] md:h-[20rem] "
      >
        <img
          src="/arro.png"
          alt=""
          className="h-full w-full opacity-0 lg:opacity-100 rotate-180 scale-x-[-1.5]"
        />
      </div>

      <div className="text-center font-gyrotrope mt-30 lg:mt-40 z-10 max-w-7xl">
        <h1 ref={heading1Ref} className="text-4xl md:text-7xl font-bold mb-6 text-white">
          Transform
          <span ref={heading2Ref} className="md:ml-2">
            Data
          </span>
        </h1>
        <h2 ref={heading3Ref} className="text-2xl md:text-7xl font-bold mb-6 text-white">
          Into Actionable Insights
        </h2>
        <button className="bg-white text-black text-sm md:text-xl mr-3 font-semibold px-4 py-2 md:px-8 md:py-4 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105">
          Try Free trial
        </button>
        <button className="bg-white text-black ml-4 md:ml-10 text-sm md:text-xl font-semibold px-4 py-2 md:px-8 md:py-4 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105">
          Scroll to Explore
        </button>
      </div>

      <div
        ref={ImageRef}
        className="relative w-full max-w-5xl mt-15 rounded-xl mac-terminal-frame "
      >
        <div className="mac-terminal-content">
          <img
            src="hero.png"
            alt="Main Section Image"
            className="w-full h-auto object-cover rounded-sm"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;