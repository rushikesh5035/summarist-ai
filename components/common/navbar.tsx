import { cn } from "@/lib/utils";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  Variants,
} from "motion/react";
import {
  ReactNode,
  SVGProps,
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Nav Icons ──────────────────────────────
const MenuIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const CloseIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

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
      "relative group text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 flex items-center py-1",
      className,
    )}
    whileHover="hover"
  >
    {children}
    <motion.div
      className="absolute bottom-0.5 left-0 right-0 h-px bg-[#0CF2A0]"
      variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }}
      initial="initial"
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  </motion.a>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      variants={headerVariants}
      initial="top"
      animate={isScrolled ? "scrolled" : "top"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed w-full top-0 z-50 px-6 md:px-10 lg:px-16 border-b transition-all duration-100 ${isScrolled ? "backdrop-blur-xl" : "backdrop-blur-none"}`}
    >
      <nav className="flex justify-between items-center max-w-5xl mx-auto h-15">
        {/* LOGO */}
        <div className="flex items-center shrink-0">
          <div className="w-9 h-9 bg-linear-to-br from-[#0CF2A0] to-[#0CF2A0]/60 rounded-xl flex items-center justify-center relative">
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
            <span className="text-xl font-bold text-white ml-2.5 tracking-tight">
              Summarist
            </span>
          </Link>
        </div>

        {/* Nav Menu */}
        <div className="hidden md:flex items-center justify-center grow space-x-8 px-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How it Works</NavLink>
          <NavLink href="#use-cases">Use Cases</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </div>

        <div className="flex items-center shrink-0">
          <Button
            onClick={() => router.push("/")}
            className="bg-[#0CF2A0] text-[#0a0a0a] hover:bg-[#0CF2A0]/90 px-5 py-2 text-sm font-semibold rounded-xl shadow-lg shadow-[#0CF2A0]/10"
          >
            Sign in
          </Button>
          <motion.button
            className="md:hidden text-gray-300 hover:text-white z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-sm shadow-lg py-4 border-t border-gray-800/50"
          >
            <div className="flex flex-col items-center space-y-4 px-6">
              <NavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </NavLink>
              <NavLink
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it Works
              </NavLink>
              <NavLink
                href="#use-cases"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Use Cases
              </NavLink>
              <NavLink
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </NavLink>
              <hr className="w-full border-t border-gray-700/50 my-2" />
              <NavLink href="#" onClick={() => setIsMobileMenuOpen(false)}>
                Sign in
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
