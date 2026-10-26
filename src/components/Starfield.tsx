"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  color: string;
  hasSpikes?: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initStars();
    };

    window.addEventListener("resize", handleResize);

    const starPalettes = [
      "#ffffff",
      "#ffffff",
      "#f0f9ff",
      "#e0f2fe",
      "#93c5fd",
      "#c7d2fe",
      "#fef08a",
    ];

    let stars: Star[] = [];
    const starCount = Math.floor((width * height) / 1600); // Dense starry night

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const isMajor = Math.random() < 0.05;
        const isBright = isMajor || Math.random() < 0.2;
        const baseAlpha = isBright ? 0.75 + Math.random() * 0.25 : 0.4 + Math.random() * 0.4;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: isMajor ? Math.random() * 1.0 + 1.8 : isBright ? Math.random() * 0.7 + 1.2 : Math.random() * 0.7 + 0.6,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: (Math.random() * 0.02 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
          color: starPalettes[Math.floor(Math.random() * starPalettes.length)],
          hasSpikes: isMajor,
        });
      }
    };

    initStars();

    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: Math.PI / 4,
      opacity: 0,
      active: false,
    };

    let nextShootingStarTime = Date.now() + 1500;

    const triggerShootingStar = () => {
      shootingStar = {
        x: Math.random() * (width * 0.75),
        y: Math.random() * (height * 0.4),
        length: Math.random() * 110 + 80,
        speed: Math.random() * 15 + 12,
        angle: (Math.PI / 180) * (30 + Math.random() * 25),
        opacity: 1,
        active: true,
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render crisp stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0.3) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.25, Math.min(1, star.alpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Stellar diffraction cross for prominent celestial beacons
        if (star.hasSpikes && star.alpha > 0.5) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = star.alpha * 0.5;
          const spikeLen = star.radius * 4;

          ctx.beginPath();
          ctx.moveTo(star.x - spikeLen, star.y);
          ctx.lineTo(star.x + spikeLen, star.y);
          ctx.moveTo(star.x, star.y - spikeLen);
          ctx.lineTo(star.x, star.y + spikeLen);
          ctx.stroke();

          // Luminous aura
          ctx.globalAlpha = star.alpha * 0.25;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render shooting star
      const now = Date.now();
      if (!shootingStar.active && now > nextShootingStarTime) {
        triggerShootingStar();
        nextShootingStarTime = now + 5000 + Math.random() * 8000;
      }

      if (shootingStar.active) {
        ctx.globalAlpha = shootingStar.opacity;
        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

        const grad = ctx.createLinearGradient(
          tailX,
          tailY,
          shootingStar.x,
          shootingStar.y
        );
        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(0.6, "rgba(186, 230, 253, 0.7)");
        grad.addColorStop(1, "rgba(255, 255, 255, 1)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.02;

        if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar.active = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
