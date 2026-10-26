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
    let isPaused = false;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const starPalettes = [
      "#ffffff",
      "#ffffff",
      "#f8fafc",
      "#e0f2fe", // Ice blue
      "#93c5fd", // Stellar blue
      "#c7d2fe", // Celestial indigo
      "#fef08a", // Soft golden dwarf
    ];

    let stars: Star[] = [];
    const starCount = Math.floor((width * height) / 1800);

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const isMajor = Math.random() < 0.05;
        const isBright = isMajor || Math.random() < 0.2;
        const baseAlpha = isBright ? 0.75 + Math.random() * 0.25 : 0.35 + Math.random() * 0.45;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: isMajor
            ? Math.random() * 1.0 + 1.8
            : isBright
            ? Math.random() * 0.6 + 1.1
            : Math.random() * 0.6 + 0.5,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: (Math.random() * 0.02 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
          color: starPalettes[Math.floor(Math.random() * starPalettes.length)],
          hasSpikes: isMajor,
        });
      }
    };

    initStars();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        initStars();
      }, 150);
    };

    // Battery & Performance Optimization: Pause rendering when screen is locked or hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
      } else {
        isPaused = false;
        render();
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: Math.PI / 4,
      opacity: 0,
      active: false,
    };

    let nextShootingStarTime = Date.now() + 2000;

    const triggerShootingStar = () => {
      shootingStar = {
        x: Math.random() * (width * 0.75),
        y: Math.random() * (height * 0.35),
        length: Math.random() * 100 + 70,
        speed: Math.random() * 14 + 10,
        angle: (Math.PI / 180) * (32 + Math.random() * 24),
        opacity: 0.95,
        active: true,
      };
    };

    const render = () => {
      if (isPaused) return;

      ctx.clearRect(0, 0, width, height);

      // Render cosmic background stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.98 || star.alpha < 0.25) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.18, Math.min(1, star.alpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Stellar diffraction cross for prominent celestial beacons
        if (star.hasSpikes && star.alpha > 0.45) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.7;
          ctx.globalAlpha = star.alpha * 0.45;
          const spikeLen = star.radius * 3.8;

          ctx.beginPath();
          ctx.moveTo(star.x - spikeLen, star.y);
          ctx.lineTo(star.x + spikeLen, star.y);
          ctx.moveTo(star.x, star.y - spikeLen);
          ctx.lineTo(star.x, star.y + spikeLen);
          ctx.stroke();

          // Luminous aura
          ctx.globalAlpha = star.alpha * 0.2;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render shooting star
      const now = Date.now();
      if (!shootingStar.active && now > nextShootingStarTime) {
        triggerShootingStar();
        nextShootingStarTime = now + 6000 + Math.random() * 9000;
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
        ctx.lineWidth = 1.8;
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
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: 0.96 }}
    />
  );
}
