import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Feature from "../compo/Home/Feture"; // Assuming this is your Feature.jsx component
import "./Home.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const DataDashboardLanding = () => {
  const laptopRef = useRef(null);
  const titleRef = useRef(null);

  // Refs for the four feature blocks in the dashboard section
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);
 const animateCard = (ref, animation) => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        animation.from || {},
        {
          ...animation.to,
          scrollTrigger: {
            trigger: ref.current,
            start: animation.start || "top 90%",
            end: animation.end || "bottom center",
            toggleActions: animation.toggle || "play reverse play reverse",
            // markers: animation.markers || false,
          },
        }
      );
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const mySplitText = new SplitText(titleRef.current, { type: "chars" });
        gsap.fromTo(
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
      if (laptopRef.current) {
        gsap.fromTo(
          laptopRef.current,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            reverseEase: "power2.in",
            reverseDuration: 1,
            scrollTrigger: {
              trigger: laptopRef.current,
              start: "top center+=150",
              end: "bottom 30%",
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
      markers: true,
    });

    animateCard(card2Ref, {
      from: { y: -150, opacity: 0 },
      to: { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
    });

    animateCard(card3Ref, {
      from: { y: 150, opacity: 0 },
      to: { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
    });

    animateCard(card4Ref, {
      from: { x: 150, opacity: 0 },
      to: { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
    });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white text-white overflow-hidden">
      {/* Section 1: Hero */}
      <section className="h-screen flex flex-col justify-center items-center px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 z-0"></div>
        <div className="text-center z-10 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Transform Data Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Actionable Insights
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Our AI-powered platform automatically analyzes your data and creates
            stunning, interactive dashboards in seconds.
          </p>
          <button className="bg-white text-black text-lg font-semibold px-8 py-4 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105">
            Try It Free
          </button>
        </div>
        <div className="absolute bottom-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Section 2: Features - Now a separate component */}
      <Feature />

      {/* Section 3: Dashboard Preview */}
      <section
        id="dashboard"
        className="min-h-screen  flex flex-col justify-center m-6 px-8 py-10 text-white"
      >
        <div className="max-w-7xl mx-13 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Dashboard Preview */}
          <div ref={laptopRef} className="relative w-full aspect-video">
            {/* ... (laptop frame and image) ... */}
            <img
              src="./pngwing.com.png"
              alt="Laptop Frame"
              className="w-full h-auto"
            />
            <div className="absolute top-[5%] left-[12%] w-[76%] h-[82%]">
              <img
                src="./image.png"
                alt="Dashboard Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Caption and Feature Blocks */}
          <div className="flex ml-14 flex-col h-full justify-start">
            <h2
              ref={titleRef}
              className="text-7xl mozilla-headline font-bold mb-8 text-black"
            >
              Dashboard
            </h2>
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
                  gallery of interactive charts, from bar graphs to scatter
                  plots.
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

      {/* Section 4: How It Works */}
      <section className="h-full mt-18 flex flex-col justify-center px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="space-y-20">
            {[
              {
                step: "01",
                title: "Upload Your Data",
                description:
                  "Simply drag and drop your CSV, Excel, or JSON file. Our system automatically detects the structure and content of your data.",
                direction: "left",
              },
              {
                step: "02",
                title: "Automatic Analysis",
                description:
                  "Our AI engine processes your data, identifies key metrics, relationships, and patterns worth highlighting.",
                direction: "right",
              },
              {
                step: "03",
                title: "Dashboard Generation",
                description:
                  "We create a complete dashboard with appropriate visualizations, KPIs, and a data story tailored to your dataset.",
                direction: "left",
              },
              {
                step: "04",
                title: "Explore & Share",
                description:
                  "Interact with your dashboard, customize if needed, and share insights with your team or clients.",
                direction: "right",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  item.direction === "right"
                    ? "md:flex-row-reverse"
                    : "md:flex-row"
                } items-center gap-10`}
              >
                <div className="flex-1">
                  <span className="text-6xl font-bold text-gray-700">
                    {item.step}
                  </span>
                  <h3 className="text-2xl font-semibold my-4">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                <div className="flex-1 bg-gray-900 h-64 rounded-xl border border-white border-opacity-10 flex items-center justify-center">
                  <p className="text-gray-600">
                    Step {item.step} Visualization
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-8 border-t border-white border-opacity-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold">DataInsight</h1>
            </div>
            <p className="text-gray-400">
              Transforming raw data into actionable insights with AI-powered
              analytics.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Product</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white border-opacity-10 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} DataInsight. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DataDashboardLanding;
