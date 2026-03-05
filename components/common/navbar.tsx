"use client";

import { type MouseEvent as ReactMouseEvent, ReactNode, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { motion, useMotionValueEvent, useScroll, Variants } from "motion/react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

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
}) => (
  <motion.a
    href={href}
    onClick={onClick}
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

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

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

  return (
    <motion.header
      variants={headerVariants}
      initial="top"
      animate={isScrolled ? "scrolled" : "top"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 z-50 w-full border-b px-6 transition-all duration-100 md:px-10 lg:px-16 ${isScrolled ? "backdrop-blur-xl" : "backdrop-blur-none"}`}
    >
      <nav className="mx-auto flex h-15 max-w-5xl items-center justify-between">
        {/* LOGO */}
        <div className="flex shrink-0 items-center">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[#0CF2A0] to-[#0CF2A0]/60">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6Z"
                fill="#0a0a0a"
                fillOpacity="0.8"
              />
              <path d="M14 2V8H20" fill="#0a0a0a" fillOpacity="0.5" />
              <path
                d="M14 2L20 8"
                stroke="#0a0a0a"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="15"
                r="3.5"
                stroke="#0CF2A0"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M10 15L11.2 16.5L14 13.5"
                stroke="#0CF2A0"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Link href={"/"}>
            <span className="ml-2.5 text-xl font-bold tracking-tight text-white">
              Summarist
            </span>
          </Link>
        </div>

        {/* Nav Menu */}
        <div className="hidden grow items-center justify-center space-x-8 px-4 md:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How it Works</NavLink>
          <NavLink href="#use-cases">Use Cases</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {!isLoaded ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : (
            <>
              <SignedIn>
                <UserButton />
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
