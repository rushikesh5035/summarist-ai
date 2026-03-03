"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../common/navbar";
import ShinyText from "../common/ShinyText";
import RotatingText from "../common/RotatingText";
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
          Math.min(dot.currentOpacity, BASE_OPACITY_MAX),
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
        dot.currentOpacity + interactionFactor * OPACITY_BOOST,
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
        handleMouseLeave,
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

  return (
    <div className="relative bg-[#0a0a0a] text-gray-300 overflow-x-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
      />
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(12, 242, 160, 0.08) 0%, transparent 60%), linear-gradient(to bottom, transparent 0%, #0a0a0a 95%)",
        }}
      />

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero Content ── */}
      <main className="relative z-10 pt-35 pb-8">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16">
          {/* Top Badge */}
          <motion.div
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center mb-8"
          >
            <div className="bg-[#1a1a1a] border border-gray-700 px-4 py-1 rounded-full text-xs sm:text-sm font-medium cursor-pointer hover:border-[#0CF2A0]/50 transition-colors flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0CF2A0]" />
              <ShinyText
                text="AI-Powered PDF Intelligence"
                className="text-[#0CF2A0]"
              />
              <ChevronRight className="w-3.5 h-3.5 text-[#0CF2A0]" />
            </div>
          </motion.div>

          {/* Headline */}
          <div className="text-center max-w-5xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-extrabold text-white leading-[1.08] tracking-tight"
            >
              Transform PDFs into
              <br />
              <span className="inline-flex h-[1.3em] overflow-hidden align-bottom justify-center text-[#0CF2A0]">
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
            className="text-center text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Upload any PDF and get instant AI summaries or have a real
            conversation with your document.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.div>
              <Button
                size="lg"
                onClick={() => router.push("/pdf-tools")}
                className="bg-[#0CF2A0] text-[#0a0a0a] hover:bg-[#0CF2A0]/90 rounded-xl px-10 text-base font-bold shadow-xl shadow-[#0CF2A0]/20 gap-2.5"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* ── Video Preview Mockup ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto mb-16"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gray-800/60 bg-[#111] shadow-2xl shadow-black/50">
              {/* Browser Chrome */}
              <div className="flex items-center px-4 py-3 bg-[#0d0d0d] border-b border-gray-800/50">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-[#1a1a1a] rounded-lg px-4 py-1.5 text-xs text-gray-500 text-center border border-gray-800/40">
                    summarist.ai/dashboard
                  </div>
                </div>
              </div>
              {/* Video Area */}
              <div className="relative aspect-video bg-linear-to-br from-[#0d0d0d] via-[#111] to-[#0d0d0d] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(12,242,160,0.06),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.05),transparent_50%)]" />
                {/* Play Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10 w-20 h-20 rounded-full bg-[#0CF2A0]/10 border-2 border-[#0CF2A0]/30 flex items-center justify-center backdrop-blur-sm group cursor-pointer"
                >
                  <div className="w-0 h-0 border-l-18 border-l-[#0CF2A0] border-t-11 border-t-transparent border-b-11 border-b-transparent ml-1.5 group-hover:border-l-white transition-colors" />
                </motion.button>
                {/* Decorative Elements */}
                <div className="absolute bottom-6 left-6 text-xs text-gray-600">
                  <span className="text-[#0CF2A0]/60 font-medium">00:00</span> /
                  02:34
                </div>
                <div className="absolute bottom-6 right-6 flex gap-3">
                  <div className="w-5 h-5 rounded bg-white/5 border border-gray-700/50" />
                  <div className="w-5 h-5 rounded bg-white/5 border border-gray-700/50" />
                </div>
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
                  <div className="h-full w-0 bg-[#0CF2A0]/60 rounded-r" />
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
