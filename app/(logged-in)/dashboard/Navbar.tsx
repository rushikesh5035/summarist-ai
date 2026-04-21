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
import { Zap } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, Variants } from "motion/react";

import { getUserCredits } from "@/actions/credits-actions";
import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
  const { isLoaded, isSignedIn } = useUser();

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
          <div className="flex shrink-0 items-center">
            <div className="relative flex items-center justify-center">
              <Logo size={28} />
            </div>
            <span className="ml-1.5 text-xl font-bold tracking-tight text-white">
              Summarist
            </span>
          </div>
        </Link>

        {/* NavMenu */}
        <div className="flex grow items-center justify-center space-x-4 px-2 text-xs sm:space-x-8 sm:px-4 sm:text-sm">
          <NavLink href="/dashboard">Upload a PDF</NavLink>
          <NavLink href="/vault">My Vault</NavLink>
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
                    <div
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                        credits.isUnlimited
                          ? "border-[#0CF2A0]/30 bg-[#0CF2A0]/10 text-[#0CF2A0]"
                          : credits.remaining === 0
                            ? "border-red-500/30 bg-red-500/10 text-red-400"
                            : "border-gray-700 bg-white/5 text-gray-300"
                      }`}
                    >
                      <Zap className="h-3 w-3" />
                      {credits.isUnlimited
                        ? `${credits.planName} (∞)`
                        : `${credits.remaining}/${credits.uploadLimit}`}
                    </div>
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
