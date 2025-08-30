import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./css/Work.css"
gsap.registerPlugin(ScrollTrigger, SplitText);

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const stepRefs = useRef([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hollow to Fill Text Animation
      if (titleRef.current) {
        // Split the text into words
        const mySplitText = new SplitText(titleRef.current, {
          type: "words, chars",
        });
        const words = mySplitText.words;
        const chars = mySplitText.chars;

        // Set initial state for filled text on characters for the hover effect
        gsap.set(chars, {
          color: "black",
          webkitTextStroke: "1px black",
        });

        // Animate each character on hover
        chars.forEach((char) => {
          char.addEventListener("mouseenter", () => {
            gsap.to(char, {
              color: "transparent",
              webkitTextStroke: "1px black",
              duration: 0.3,
              ease: "power2.out",
            });
          });

          char.addEventListener("mouseleave", () => {
            gsap.to(char, {
              color: "black",
              duration: 0.3,
              ease: "power2.out",
            });
          });
        });

        // Main scroll animation for the words
        // Split the words into two halves
        const firstHalfWords = words.slice(0, Math.ceil(words.length / 2));
        const secondHalfWords = words.slice(Math.ceil(words.length / 2));

        // Animate the first half from the left
        gsap.fromTo(
          firstHalfWords,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play reverse play reverse",
            },
          }
        );

        // Animate the second half from the right
        gsap.fromTo(
          secondHalfWords,
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // Animate the main title on scroll
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate each step block separately
      stepRefs.current.forEach((el, index) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Animate each video div
      videoRefs.current.forEach((el, index) => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
              onEnter: () => {
                const video = el.querySelector('video');
                if (video && video.paused) {
                  video.play();
                }
              },
              onLeave: () => {
                const video = el.querySelector('video');
                if (video && !video.paused) {
                  video.pause();
                }
              },
              onEnterBack: () => {
                const video = el.querySelector('video');
                if (video && video.paused) {
                  video.play();
                }
              },
              onLeaveBack: () => {
                const video = el.querySelector('video');
                if (video && !video.paused) {
                  video.pause();
                }
              }
            },
          }
        );
        const hoverTween = gsap.to(el, {
          scale: 1.05,
          paused: true,
          duration: 0.5,
        });

        el.addEventListener("mouseenter", () => hoverTween.play());
        el.addEventListener("mouseleave", () => hoverTween.reverse());
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return (
    <section
      ref={sectionRef}
      className="h-full text-black flex flex-col justify-center mb-13 ml-2"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          ref={titleRef}
          className="angkor-regular text-8xl font-bold text-center mb-25"
        >
          How It Works !
        </h2>
        <div className="">
          {[
            {
              step: "01",
              title: "Upload Your Data",
              description:
                "Simply drag and drop your CSV, Excel, or JSON file. Our system automatically detects the structure and content of your data.",
              direction: "left",
              videoSrc: "./drag.webm",
              poster: "./drag_poster.jpg"
            },
            {
              step: "02",
              title: "Automatic Analysis",
              description:
                "Our AI engine processes your data, identifies key metrics, relationships, and patterns worth highlighting.",
              direction: "right",
              videoSrc: "./loading.webm",
              poster: "./loading_poster.jpg"
            },
            {
              step: "03",
              title: "Dashboard Generation",
              description:
                "We create a complete dashboard with appropriate visualizations, KPIs, and a data story tailored to your dataset.",
              direction: "left",
              videoSrc: "./dashh.webm",
              poster: "./dashh_poster.jpg"
            },
            {
              step: "04",
              title: "Explore & Share",
              description:
                "Interact with your dashboard, customize if needed, and share insights with your team or clients.",
              direction: "right",
              videoSrc: "./video_share.mp4",
              poster: "./share_poster.jpg"
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                item.direction === "right"
                  ? "md:flex-row-reverse"
                  : "md:flex-row"
              } items-center gap-18 mb-5`}
              ref={(el) => (stepRefs.current[index] = el)}
            >
              <div className="flex-1">
                <span className="text-6xl font-bold text-gray-700">
                  {item.step}
                </span>
                <h3 className="text-4xl font-semibold my-4">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
              <div
                className="flex-1 rounded-xl overflow-hidden border border-white border-opacity-10"
                ref={(el) => (videoRefs.current[index] = el)}
              >
                <video
                  src={item.videoSrc}
                  loop
                  muted
                  autoPlay={false} // Autoplay is now handled by ScrollTrigger
                  playsInline // Recommended for mobile to play in place
                  preload="metadata" // Optimized preloading
                  poster={item.poster} // Added poster image
                  className="w-full h-auto saturate-150"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;