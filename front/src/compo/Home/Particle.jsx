// src/components/ParticleBackground.jsx
import React, { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    const particleCount = 80; // number of particles
    const maxSize = 2; // particle size
    const speed = 0.2; // movement speed

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width-20,
          y: Math.random() * canvas.height-20,
          radius: Math.random() * maxSize + 1,
          dx: (Math.random() - 0.5) * speed, // slight horizontal drift
          dy: (Math.random() - 0.5) * speed, // slight vertical drift
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.beginPath();

      particles.forEach((p) => {
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
      });

      ctx.fill();
      updateParticles();
    };

    const updateParticles = () => {
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        // wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
    };

    const animate = () => {
      drawParticles();
      requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
    />
  );
};

export default ParticleBackground;
