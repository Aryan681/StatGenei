import React, {
  useEffect,
  useRef,
  forwardRef,
  useState,
  lazy,
  Suspense,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./css/Hero.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/context";

// Dynamically import the modal component
const AuthPromptModal = lazy(() => import("../auth/AuthPromptModal"));

gsap.registerPlugin(ScrollTrigger, SplitText);

const Hero = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heading1Ref = useRef(null);
  const heading2Ref = useRef(null);
  const heading3Ref = useRef(null);
  const imageRef = useRef(null);
  const svgRefs = useRef([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const triggerStart = isDesktop ? "top 80%" : "top 95%";

      const animateText = (element, yFrom, isGradient = false) => {
        if (!element) return;
        const mySplitText = new SplitText(element, { type: "chars" });

        if (isGradient) {
          mySplitText.chars.forEach((char) => {
            char.style.backgroundImage =
              "linear-gradient(to right, #a855f7, #4f46e5)";
            char.style.webkitBackgroundClip = "text";
            char.style.backgroundClip = "text";
            char.style.color = "transparent";
          });
        }

        gsap.fromTo(
          mySplitText.chars,
          { y: yFrom, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: triggerStart,
              toggleActions: "play reverse play reverse",
            },
          }
        );
      };

      animateText(heading1Ref.current, 20);
      animateText(heading2Ref.current, 20, true);
      animateText(heading3Ref.current, -20);

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: imageRef.current,
              start: isDesktop ? "top 80%" : "top-=30 45%",
              end: isDesktop ? "top center-=30" : "top+=80 center-=30",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      const arrowAnimationOffset = 50;
      const arrowsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heading1Ref.current,
          start: "top 70%",
          toggleActions: "play reverse play reverse",
        },
      });

      arrowsTimeline.fromTo(
        svgRefs.current[0],
        { x: arrowAnimationOffset, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
        0
      );
      arrowsTimeline.fromTo(
        svgRefs.current[1],
        { x: -arrowAnimationOffset, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
        "<"
      );

      gsap.to(svgRefs.current.slice(0, 2), {
        y: -10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      if (svgRefs.current[2]) {
        gsap.fromTo(
          svgRefs.current[2],
          { y: 100, opacity: 0 },
          {
            y: 0,
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
    }); // End of gsap.context

    return () => ctx.revert(); // ✅ Proper cleanup
  }, []);

  const handleTryFreeTrial = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate("/Dashboard");
    }
  };

  return (
    <section
      ref={ref}
      className="h-full lg:h-screen flex flex-col justify-center items-center px-8 relative overflow-hidden"
    >
      {/* Dynamic import and suspense for the modal */}
      <Suspense fallback={<div>Loading...</div>}>
        <AuthPromptModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </Suspense>

      <div className="absolute inset-0 bg-gradient-to-b from-black to-[#0F0E0E] z-0"></div>

      <div className="text-center font-gyrotrope mt-30 lg:mt-40 z-10 max-w-7xl">
        <h1
          ref={heading1Ref}
          className="text-4xl md:text-6xl font-bold mb-6 text-white"
          // className="text-4xl md:text-7xl font-bold mb-6 text-white"
        >
          Transform
          <span ref={heading2Ref} className="md:ml-2 text-[#7917e5]">
            Data
          </span>
        </h1>
        <h2
          ref={heading3Ref}
          className="text-2xl md:text-6xl font-bold mb-6 text-white"
          // className="text-2xl md:text-7xl font-bold mb-6 text-white"
        >
          Into Actionable Insights
        </h2>
        <h3 className="text-sm md:text-xl font-bold mb-6 opacity-70 text-white">
          Stop wasting 30–45 minutes analyzing Excel/CSV data. StatGenie makes it simple—no SQL, no complex BI tools, just instant answers.
        </h3>
        <button
          onClick={handleTryFreeTrial}
          className="bg-white text-black text-sm md:text-xl mr-3 font-semibold px-4 py-2 md:px-8 md:py-4 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105"
        >
          Try Free trial
        </button>
        <button className="bg-white text-black ml-4 md:ml-10 text-sm md:text-xl font-semibold px-4 py-2 md:px-8 md:py-4 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105">
          Scroll to Explore
        </button>
        
      </div>

      <div
        ref={imageRef}
        className="relative w-full max-w-5xl mt-15 rounded-xl mac-terminal-frame "
      >
        <div className="mac-terminal-content">
          <img
            src="hero.png"
            alt="A dashboard visualization showing data transformed into actionable insights"
            className="w-full h-auto object-cover rounded-sm"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
});

export default Hero;
