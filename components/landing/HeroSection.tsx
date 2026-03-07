"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@clerk/nextjs";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import Navbar from "../common/navbar";
import RotatingText from "../common/RotatingText";
import ShinyText from "../common/ShinyText";
import ScrollingMarquee from "./ScrollingMarquee";

// ── Dot Grid Canvas ──────────────────────────────
interface Dot {
  x: number;
  y: number;
  baseColor: string;
  targetOpacity: number;
  currentOpacity: number;
  opacitySpeed: number;
  baseRadius: number;
  currentRadius: number;
}

// ── Main Component ──────────────────────────────
const HeroSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const dotsRef = useRef<Dot[]>([]);
  const gridRef = useRef<Record<string, number[]>>({});
  const canvasSizeRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  const DOT_SPACING = 25;
  const BASE_OPACITY_MIN = 0.4;
  const BASE_OPACITY_MAX = 0.5;
  const BASE_RADIUS = 1;
  const INTERACTION_RADIUS = 150;
  const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;
  const OPACITY_BOOST = 0.6;
  const RADIUS_BOOST = 2.5;
  const GRID_CELL_SIZE = Math.max(50, Math.floor(INTERACTION_RADIUS / 1.5));

  const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      mousePositionRef.current = { x: null, y: null };
      return;
    }
    const rect = canvas.getBoundingClientRect();
    mousePositionRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  const createDots = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    if (width === 0 || height === 0) return;
    const newDots: Dot[] = [];
    const newGrid: Record<string, number[]> = {};
    const cols = Math.ceil(width / DOT_SPACING);
    const rows = Math.ceil(height / DOT_SPACING);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * DOT_SPACING + DOT_SPACING / 2;
        const y = j * DOT_SPACING + DOT_SPACING / 2;
        const cellKey = `${Math.floor(x / GRID_CELL_SIZE)}_${Math.floor(y / GRID_CELL_SIZE)}`;
        if (!newGrid[cellKey]) newGrid[cellKey] = [];
        newGrid[cellKey].push(newDots.length);
        const baseOpacity =
          Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) +
          BASE_OPACITY_MIN;
        newDots.push({
          x,
          y,
          baseColor: `rgba(87, 220, 205, ${BASE_OPACITY_MAX})`,
          targetOpacity: baseOpacity,
          currentOpacity: baseOpacity,
          opacitySpeed: Math.random() * 0.005 + 0.002,
          baseRadius: BASE_RADIUS,
          currentRadius: BASE_RADIUS,
        });
      }
    }
    dotsRef.current = newDots;
    gridRef.current = newGrid;
  }, [
    DOT_SPACING,
    GRID_CELL_SIZE,
    BASE_OPACITY_MIN,
    BASE_OPACITY_MAX,
    BASE_RADIUS,
  ]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;
    if (
      canvas.width !== width ||
      canvas.height !== height ||
      canvasSizeRef.current.width !== width ||
      canvasSizeRef.current.height !== height
    ) {
      canvas.width = width;
      canvas.height = height;
      canvasSizeRef.current = { width, height };
      createDots();
    }
  }, [createDots]);

  const animateDots = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const dots = dotsRef.current;
    const grid = gridRef.current;
    const { width, height } = canvasSizeRef.current;
    const { x: mouseX, y: mouseY } = mousePositionRef.current;

    if (!ctx || !dots || !grid || width === 0 || height === 0) {
      animationFrameId.current = requestAnimationFrame(animateDots);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const activeDotIndices = new Set<number>();
    if (mouseX !== null && mouseY !== null) {
      const mouseCellX = Math.floor(mouseX / GRID_CELL_SIZE);
      const mouseCellY = Math.floor(mouseY / GRID_CELL_SIZE);
      const searchRadius = Math.ceil(INTERACTION_RADIUS / GRID_CELL_SIZE);
      for (let i = -searchRadius; i <= searchRadius; i++) {
        for (let j = -searchRadius; j <= searchRadius; j++) {
          const cellKey = `${mouseCellX + i}_${mouseCellY + j}`;
          if (grid[cellKey])
            grid[cellKey].forEach((idx) => activeDotIndices.add(idx));
        }
      }
    }

    dots.forEach((dot, index) => {
      dot.currentOpacity += dot.opacitySpeed;
      if (
        dot.currentOpacity >= dot.targetOpacity ||
        dot.currentOpacity <= BASE_OPACITY_MIN
      ) {
        dot.opacitySpeed = -dot.opacitySpeed;
        dot.currentOpacity = Math.max(
          BASE_OPACITY_MIN,
          Math.min(dot.currentOpacity, BASE_OPACITY_MAX)
        );
        dot.targetOpacity =
          Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) +
          BASE_OPACITY_MIN;
      }

      let interactionFactor = 0;
      dot.currentRadius = dot.baseRadius;

      if (mouseX !== null && mouseY !== null && activeDotIndices.has(index)) {
        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < INTERACTION_RADIUS_SQ) {
          const distance = Math.sqrt(distSq);
          interactionFactor = Math.max(0, 1 - distance / INTERACTION_RADIUS);
          interactionFactor = interactionFactor * interactionFactor;
        }
      }

      const finalOpacity = Math.min(
        1,
        dot.currentOpacity + interactionFactor * OPACITY_BOOST
      );
      dot.currentRadius = dot.baseRadius + interactionFactor * RADIUS_BOOST;

      ctx.beginPath();
      ctx.fillStyle = `rgba(87, 220, 205, ${finalOpacity.toFixed(3)})`;
      ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(animateDots);
  }, [
    GRID_CELL_SIZE,
    INTERACTION_RADIUS,
    INTERACTION_RADIUS_SQ,
    OPACITY_BOOST,
    RADIUS_BOOST,
    BASE_OPACITY_MIN,
    BASE_OPACITY_MAX,
    BASE_RADIUS,
  ]);

  useEffect(() => {
    handleResize();
    const handleMouseLeave = () => {
      mousePositionRef.current = { x: null, y: null };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    animationFrameId.current = requestAnimationFrame(animateDots);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [handleResize, handleMouseMove, animateDots]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const contentDelay = 0.3;
  const bannerVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: contentDelay },
    },
  };

  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-[#0a0a0a] text-gray-300">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
      />
      <div
        className="pointer-events-none absolute inset-0 z-1"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(12, 242, 160, 0.08) 0%, transparent 60%), linear-gradient(to bottom, transparent 0%, #0a0a0a 95%)",
        }}
      />

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero Content ── */}
      <main className="relative z-10 pt-35 pb-8">
        <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
          {/* Top Badge */}
          <motion.div
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 flex justify-center"
          >
            <div className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-700 bg-[#1a1a1a] px-4 py-1 text-xs font-medium transition-colors hover:border-[#0CF2A0]/50 sm:text-sm">
              <Sparkles className="h-4 w-4 text-[#0CF2A0]" />
              <ShinyText
                text="AI-Powered PDF Intelligence"
                className="text-[#0CF2A0]"
              />
              <ChevronRight className="h-3.5 w-3.5 text-[#0CF2A0]" />
            </div>
          </motion.div>

          {/* Headline */}
          <div className="mx-auto max-w-5xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl leading-[1.08] font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[82px]"
            >
              Transform PDFs into
              <br />
              <span className="inline-flex h-[1.3em] justify-center overflow-hidden align-bottom text-[#0CF2A0]">
                <RotatingText
                  texts={[
                    "Smart Summaries",
                    "Conversations",
                    "Key Insights",
                    "Answers",
                  ]}
                  mainClassName="pb-2"
                  staggerFrom="last"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  staggerDuration={0.01}
                  transition={{ type: "spring", damping: 18, stiffness: 250 }}
                  rotationInterval={2200}
                  splitBy="characters"
                  auto
                  loop
                />
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mx-auto mb-8 max-w-2xl text-center text-lg leading-relaxed text-gray-400 sm:text-xl"
          >
            Upload any PDF and get instant AI summaries or have a real
            conversation with your document.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div>
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="gap-2.5 rounded-xl bg-[#0CF2A0] px-10 text-base font-bold text-[#0a0a0a] shadow-xl shadow-[#0CF2A0]/20 hover:bg-[#0CF2A0]/90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* ── Video Preview Mockup ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-16 max-w-5xl"
          >
            <div className="relative overflow-hidden rounded-2xl border border-gray-800/60 bg-[#111] shadow-2xl shadow-black/50">
              {/* Browser Chrome */}
              <div className="flex items-center border-b border-gray-800/50 bg-[#0d0d0d] px-4 py-3">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="mx-4 flex-1">
                  <div className="rounded-lg border border-gray-800/40 bg-[#1a1a1a] px-4 py-1.5 text-center text-xs text-gray-500">
                    summarist.ai/dashboard
                  </div>
                </div>
              </div>
              {/* Video Area */}
              <div className="relative flex aspect-video items-center justify-center bg-linear-to-br from-[#0d0d0d] via-[#111] to-[#0d0d0d]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(12,242,160,0.06),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.05),transparent_50%)]" />
                {/* Play Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative z-10 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-[#0CF2A0]/30 bg-[#0CF2A0]/10 backdrop-blur-sm"
                >
                  <div className="ml-1.5 h-0 w-0 border-t-11 border-b-11 border-l-18 border-t-transparent border-b-transparent border-l-[#0CF2A0] transition-colors group-hover:border-l-white" />
                </motion.button>
                {/* Decorative Elements */}
                <div className="absolute bottom-6 left-6 text-xs text-gray-600">
                  <span className="font-medium text-[#0CF2A0]/60">00:00</span> /
                  02:34
                </div>
                <div className="absolute right-6 bottom-6 flex gap-3">
                  <div className="h-5 w-5 rounded border border-gray-700/50 bg-white/5" />
                  <div className="h-5 w-5 rounded border border-gray-700/50 bg-white/5" />
                </div>
                {/* Progress Bar */}
                <div className="absolute right-0 bottom-0 left-0 h-1 bg-gray-800/50">
                  <div className="h-full w-0 rounded-r bg-[#0CF2A0]/60" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Scrolling Marquee ── */}
          <ScrollingMarquee />
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
