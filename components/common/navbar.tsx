"use client";

import {
  type MouseEvent as ReactMouseEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, Variants } from "motion/react";

import { getUserCredits } from "@/actions/credits-actions";
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
  const [credits, setCredits] = useState<{
    remaining: number;
    uploadLimit: number;
    planId: string;
    planName: string;
    isUnlimited: boolean;
  } | null>(null);
  const router = useRouter();
  const { isLoaded } = useUser();

  useEffect(() => {
    getUserCredits().then(setCredits);

    const handleFocus = () => getUserCredits().then(setCredits);
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

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
        <Link href={"/"}>
          <div className="flex shrink-0 items-center justify-center">
            <div className="relative flex items-center justify-center">
              <Logo size={28} />
              <span className="ml-1.5 text-xl font-bold tracking-tight text-white">
                Summarist
              </span>
            </div>
          </div>
        </Link>

        {/* Nav Menu */}
        <div className="hidden grow items-center justify-center space-x-8 px-4 md:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How it Works</NavLink>
          <NavLink href="#use-cases">Use Cases</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </div>

        {/* Right side - Auth Section */}
        <div className="flex min-w-[200px] shrink-0 items-center justify-end gap-4">
          {!isLoaded ? (
            <>
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </>
          ) : (
            <>
              <SignedIn>
                {!credits ? (
                  <>
                    <Skeleton className="h-8 w-32 rounded-full" />
                    <UserButton />
                  </>
                ) : (
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
                )}
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
