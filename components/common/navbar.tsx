"use client";

import { type MouseEvent as ReactMouseEvent, ReactNode, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, Variants } from "motion/react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import Logo from "./Logo";

interface NavLinkProps {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
}

const NavLink: React.FC<NavLinkProps> = ({
  href = "#",
  children,
  className = "",
  onClick,
}) => {
  const smoothScrollTo = (targetY: number) => {
    const startY = window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) return;

    const duration = 1000;
    const startTime = performance.now();

    // Slower ease-in-out curve than browser default smooth behavior.
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) return;
    if (!href.startsWith("#")) return;

    event.preventDefault();

    const target = document.querySelector(href);
    if (!target) return;

    const headerOffset = 88;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;

    smoothScrollTo(Math.max(0, targetTop));

    window.history.replaceState(null, "", href);
  };

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      className={cn(
        "group relative flex items-center py-1 text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-white",
        className
      )}
      whileHover="hover"
    >
      {children}
      <motion.div
        className="absolute right-0 bottom-0.5 left-0 h-px bg-[#0CF2A0]"
        variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }}
        initial="initial"
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </motion.a>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const router = useRouter();
  const { isLoaded } = useUser();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const headerVariants: Variants = {
    top: {
      backgroundColor: "rgba(17, 17, 17, 0)",
      borderBottomColor: "rgba(55, 65, 81, 0)",
      boxShadow: "none",
    },
    scrolled: {
      backgroundColor: "rgba(17, 17, 17, 0.85)",
      borderBottomColor: "rgba(75, 85, 99, 0.5)",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
    },
  };

  const rightControlsSkeleton = (
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-26 rounded-full bg-white/8" />
      <Skeleton className="h-8 w-8 rounded-full bg-white/8" />
    </div>
  );

  return (
    <motion.header
      variants={headerVariants}
      initial="top"
      animate={isScrolled ? "scrolled" : "top"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 z-50 w-full border-b transition-all duration-100 ${isScrolled ? "backdrop-blur-xl" : "backdrop-blur-none"}`}
    >
      <nav className="relative mx-auto flex h-15 w-full max-w-6xl items-center px-6 md:px-10 lg:px-16">
        <Link href={"/"} className="shrink-0">
          <div className="flex shrink-0 items-center justify-center">
            <div className="relative flex items-center justify-center">
              <Logo size={28} />
              <span className="ml-1.5 text-xl font-bold tracking-tight text-white">
                Summarist
              </span>
            </div>
          </div>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center space-x-8 md:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How it Works</NavLink>
          <NavLink href="#use-cases">Use Cases</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </div>

        <div className="ml-auto flex min-w-50 shrink-0 items-center justify-end gap-4">
          {!isLoaded ? (
            rightControlsSkeleton
          ) : (
            <>
              <SignedIn>
                <>
                  <motion.a
                    href="/dashboard"
                    className="group relative flex items-center gap-1.5 rounded-full border border-gray-700/60 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors duration-200 hover:border-[#0CF2A0]/40 hover:bg-[#0CF2A0]/5 hover:text-[#0CF2A0]"
                    title="Go to Dashboard"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                    <motion.span
                      className="absolute right-3 bottom-0.5 left-3 h-px origin-left bg-[#0CF2A0]"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  </motion.a>
                  <UserButton />
                </>
              </SignedIn>
              <SignedOut>
                <Button
                  onClick={() => router.push("/sign-in")}
                  className="rounded-xl bg-[#0CF2A0] px-5 py-2 text-sm font-semibold text-[#0a0a0a] shadow-lg shadow-[#0CF2A0]/10 hover:bg-[#0CF2A0]/90"
                >
                  Sign in
                </Button>
              </SignedOut>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
