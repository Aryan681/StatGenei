import React, { useEffect ,useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger);
export default function LeftArc() {
   const ArcRef = useRef(null); 
  useEffect(()=>{
      if (ArcRef.current) {
        gsap.fromTo(
          ArcRef.current,
          { x: -100,  opacity: 0 },
          {
            x: 0,
            
            opacity: 1,
            rotation: 0,
            duration: 1.5,
            ease: "power3.out",
            reverseEase: "power4.in",
            reverseDuration: 0.8,
            scrollTrigger: {
              trigger:ArcRef.current,
              start: "top center-=20",
              end: "bottom-=90 60%",
              toggleActions: "play reverse play reverse",
              // markers: true,
            },
          }
        );
      }
  })
  return (
    <div ref={ArcRef} className="absolute -left-10 w-full h-full flex items-center justify-start z-0">
      <svg
        width="387"
        height="710"
        viewBox="10 -30 357 710"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="path-1-inside-1_6_242" fill="white">
          <path d="M0.500004 0C95.0497 9.64616e-07 185.727 32.1338 252.584 89.3324C319.44 146.531 357 224.109 357 305C357 385.891 319.44 463.469 252.584 520.667C185.727 577.866 95.0499 610 0.50022 610L0.5 305L0.500004 0Z" />
        </mask>
        <path
          d="M0.500004 0C95.0497 9.64616e-07 185.727 32.1338 252.584 89.3324C319.44 146.531 357 224.109 357 305C357 385.891 319.44 463.469 252.584 520.667C185.727 577.866 95.0499 610 0.50022 610L0.5 305L0.500004 0Z"
          stroke="#1E1A1A"
          strokeWidth="5"
          mask="url(#path-1-inside-1_6_242)"
        />
      </svg>
    </div>
  );
}