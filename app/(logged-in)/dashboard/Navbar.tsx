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
import { FileText, MessageSquare, Sparkles } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, Variants } from "motion/react";

import { getUserCredits } from "@/actions/credits-actions";
import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
      "group relative flex items-center py-1 text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-gray-100",
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
    planId: string;
    planName: string;
    isUnlimited: boolean;
    summaryRemaining: number;
    summaryLimit: number;
    chatRemaining: number;
    chatLimit: number;
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

  const summaryUsage =
    credits && !credits.isUnlimited && credits.summaryLimit > 0
      ? Math.round(
          ((credits.summaryLimit - credits.summaryRemaining) /
            credits.summaryLimit) *
            100
        )
      : 0;

  const chatUsage =
    credits && !credits.isUnlimited && credits.chatLimit > 0
      ? Math.round(
          ((credits.chatLimit - credits.chatRemaining) / credits.chatLimit) *
            100
        )
      : 0;

  const overallUsage = credits?.isUnlimited
    ? 100
    : Math.round((summaryUsage + chatUsage) / 2);

  const usageRingColor =
    overallUsage >= 90 ? "#f87171" : overallUsage >= 70 ? "#fbbf24" : "#0CF2A0";

  const rightControlsSkeleton = (
    <div className="flex items-center gap-2">
      <Skeleton className="h-7 w-16 rounded-full bg-white/7" />
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-700/80 bg-[#171717]">
        <Skeleton className="h-5.5 w-5.5 rounded-full bg-white/7" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full bg-white/8" />
    </div>
  );

  return (
    <motion.header
      variants={headerVariants}
      initial="top"
      animate={isScrolled ? "scrolled" : "top"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 z-50 w-full border-b border-gray-800/60 px-6 transition-all duration-100 md:px-10 lg:px-16 ${isScrolled ? "backdrop-blur-xl" : "backdrop-blur-none"}`}
    >
      <nav className="relative mx-auto flex h-15 max-w-5xl items-center">
        {/* LOGO */}
        <Link href={"/"} className="z-10 shrink-0">
          <div className="flex shrink-0 items-center">
            <div className="relative flex items-center justify-center">
              <Logo size={28} />
              <span className="ml-1.5 text-xl font-bold tracking-tight text-white">
                Summarist
              </span>
            </div>
          </div>
        </Link>

        {/* NavMenu */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <NavLink href="/dashboard" className="text-[15px]">
            Upload a PDF
          </NavLink>
          <NavLink href="/vault" className="text-[15px]">
            My Vault
          </NavLink>
        </div>

        {/* Right side - Auth Section */}
        <div className="z-10 ml-auto flex min-w-44 shrink-0 items-center justify-end gap-3">
          {!isLoaded ? (
            rightControlsSkeleton
          ) : (
            <>
              <SignedIn>
                {!credits ? (
                  rightControlsSkeleton
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${
                          credits.isUnlimited
                            ? "border-[#0CF2A0]/35 bg-[#0CF2A0]/12 text-[#0CF2A0]"
                            : "border-gray-700/90 bg-[#171717] text-gray-300"
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        {credits.planName}
                      </div>

                      <HoverCard openDelay={120} closeDelay={80}>
                        <HoverCardTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-700/90 bg-[#171717] transition-colors hover:border-gray-500"
                            title="Credits usage"
                            aria-label="View credits usage"
                          >
                            <span
                              className="relative flex h-5.5 w-5.5 items-center justify-center rounded-full"
                              style={{
                                background: credits.isUnlimited
                                  ? "conic-gradient(#0CF2A0 0deg 360deg)"
                                  : `conic-gradient(${usageRingColor} ${overallUsage * 3.6}deg, rgba(75, 85, 99, 0.35) ${overallUsage * 3.6}deg 360deg)`,
                              }}
                            >
                              <span className="h-3.5 w-3.5 rounded-full bg-[#111111]" />
                            </span>
                          </button>
                        </HoverCardTrigger>
                        <HoverCardContent
                          align="end"
                          className="w-72 border-gray-700 bg-[#111111]/95 p-3 text-gray-300 backdrop-blur"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-semibold tracking-wide text-gray-200 uppercase">
                              Credits Usage
                            </p>
                            <span className="text-[11px] text-gray-400">
                              {credits.planName} plan
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                                <span className="inline-flex items-center gap-1.5 text-gray-300">
                                  <FileText className="h-3 w-3" /> PDF summaries
                                </span>
                                <span
                                  className={cn(
                                    "font-medium",
                                    !credits.isUnlimited &&
                                      credits.summaryRemaining === 0
                                      ? "text-red-400"
                                      : "text-gray-300"
                                  )}
                                >
                                  {credits.isUnlimited
                                    ? "∞ / ∞"
                                    : `${credits.summaryRemaining} / ${credits.summaryLimit}`}
                                </span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    credits.isUnlimited
                                      ? "bg-[#0CF2A0]"
                                      : credits.summaryRemaining === 0
                                        ? "bg-red-400"
                                        : "bg-[#0CF2A0]"
                                  )}
                                  style={{
                                    width: credits.isUnlimited
                                      ? "100%"
                                      : `${Math.max(
                                          0,
                                          Math.min(
                                            100,
                                            (credits.summaryRemaining /
                                              credits.summaryLimit) *
                                              100
                                          )
                                        )}%`,
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                                <span className="inline-flex items-center gap-1.5 text-gray-300">
                                  <MessageSquare className="h-3 w-3" /> PDF
                                  chats
                                </span>
                                <span
                                  className={cn(
                                    "font-medium",
                                    !credits.isUnlimited &&
                                      credits.chatRemaining === 0
                                      ? "text-red-400"
                                      : "text-gray-300"
                                  )}
                                >
                                  {credits.isUnlimited
                                    ? "∞ / ∞"
                                    : `${credits.chatRemaining} / ${credits.chatLimit}`}
                                </span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    credits.isUnlimited
                                      ? "bg-[#0CF2A0]"
                                      : credits.chatRemaining === 0
                                        ? "bg-red-400"
                                        : "bg-[#0CF2A0]"
                                  )}
                                  style={{
                                    width: credits.isUnlimited
                                      ? "100%"
                                      : `${Math.max(
                                          0,
                                          Math.min(
                                            100,
                                            (credits.chatRemaining /
                                              credits.chatLimit) *
                                              100
                                          )
                                        )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
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
