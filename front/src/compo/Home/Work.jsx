import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./css/Work.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const stepRefs = useRef([]);
  const videoRefs = useRef([]);

  const stepsData = [
    {
      step: "01",
      title: "Upload Your Data",
      description:
        "Drag and drop your CSV, Excel, or JSON file. Our system automatically detects the structure and content.",
      direction: "left",
      videoSrc: "./drag.webm",
      poster: "./drag_poster.jpg",
    },
    {
      step: "02",
      title: "Automatic Analysis",
      description:
        "Our AI engine identifies key metrics, relationships, and patterns worth highlighting.",
      direction: "right",
      videoSrc: "./loading.webm",
      poster: "./loading_poster.jpg",
    },
    {
      step: "03",
      title: "Dashboard Generation",
      description:
        "We create a complete dashboard with visualizations, KPIs, and a data story tailored to your dataset.",
      direction: "left",
      videoSrc: "./dashh.webm",
      poster: "./dashh_poster.jpg",
    },
    {
      step: "04",
      title: "Explore & Share",
      description:
        "Interact with your dashboard, customize it, and share insights with your team or clients.",
      direction: "right",
      videoSrc: "./video_share.mp4",
      poster: "./share_poster.jpg",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title Animation using SplitText
      if (titleRef.current) {
        // Split into words for entrance
        const splitWords = new SplitText(titleRef.current, { type: "words" });
        const midIndex = Math.ceil(splitWords.words.length / 2);

        // Animate first half from left
        gsap.fromTo(
          splitWords.words.slice(0, midIndex),
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

        // Animate second half from right
        gsap.fromTo(
          splitWords.words.slice(midIndex),
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

        // Now split into chars for hover
        const splitChars = new SplitText(titleRef.current, { type: "chars" });

        splitChars.chars.forEach((char) => {
          char.style.transition = "color 0.3s ease";
          char.addEventListener("mouseenter", () => {
            char.style.color = "white";
          });
          char.addEventListener("mouseleave", () => {
            char.style.color = ""; // reset to inherited
          });
        });
      }

      // Animate steps and videos
      stepsData.forEach((item, index) => {
        const stepEl = stepRefs.current[index];
        const videoEl = videoRefs.current[index];

        if (stepEl && videoEl) {
          // Animate step text
          gsap.fromTo(
            stepEl,
            { opacity: 0, x: item.direction === "left" ? -100 : 100 },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: stepEl,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // Animate video and control playback
          gsap.fromTo(
            videoEl,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: videoEl,
                start: "top 80%",
                toggleActions: "play none none reverse",
                onEnter: () => videoEl.querySelector("video")?.play(),
                onLeave: () => videoEl.querySelector("video")?.pause(),
                onEnterBack: () => videoEl.querySelector("video")?.play(),
                onLeaveBack: () => videoEl.querySelector("video")?.pause(),
              },
            }
          );

          // Optional hover effect for video
          gsap.to(videoEl, { scale: 1.05, paused: true, duration: 0.5 });
        }
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
          How It Works!
        </h2>
        <div className="grid gap-16">
          {stepsData.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                item.direction === "right"
                  ? "md:flex-row-reverse"
                  : "md:flex-row"
              } items-center gap-18`}
            >
              <div
                ref={(el) => (stepRefs.current[index] = el)}
                className="flex-1"
              >
                <span className="text-6xl font-bold text-gray-700">
                  {item.step}
                </span>
                <h3 className="text-4xl font-semibold my-4">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
              <div
                ref={(el) => (videoRefs.current[index] = el)}
                className="flex-1 rounded-xl overflow-hidden border border-white border-opacity-10 shadow-lg"
              >
                <video
                  src={item.videoSrc}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={item.poster}
                  className="w-full h-auto saturate-150"
                  role="img"
                  aria-label={`Video demonstration for step ${item.step}: ${item.title}`}
                >
                  <track
                    kind="captions"
                    src={`./${
                      item.videoSrc.split("/").pop().split(".")[0]
                    }.vtt`}
                    srcLang="en"
                    label="English captions"
                    default
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
