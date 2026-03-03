"use client";

import React from "react";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "motion/react";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

export const AnimatedFooter = ({
  brandName = "YourBrand",
  brandDescription = "Your description here",
  navLinks = [],
  brandIcon,
  className,
}: FooterProps) => {
  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden bg-[#0a0a0a] pt-16 pb-0",
        className,
      )}
    >
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex flex-col items-center text-center">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 max-w-md"
            >
              <div className="flex items-center justify-center gap-2.5 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-[#0CF2A0] to-[#0CF2A0]/50 rounded-xl flex items-center justify-center shadow-lg shadow-[#0CF2A0]/10">
                  {brandIcon}
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  {brandName}
                </span>
              </div>
              <p className="text-gray-500 leading-relaxed">
                {brandDescription}
              </p>
            </motion.div>

            {/* Nav links */}
            {navLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap items-center justify-center gap-x-6 gap-y-9 mb-30"
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-[#0CF2A0] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border-t border-white/6 py-6 flex flex-col sm:flex-row justify-between items-center gap-3"
          >
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            <Link
              href={"https://github.com/rushikesh5035/summarist-ai"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#0CF2A0] text-sm transition-colors"
            >
              Crafted by <span className="font-bold">Rushikesh</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Large background text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="text-[12vw] md:text-[10vw] font-black text-white/2 tracking-tighter leading-none whitespace-nowrap">
          {brandName.toUpperCase()}
        </span>
      </motion.div>

      {/* Bottom glow line */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative h-0.5 w-full"
      >
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#0CF2A0]/40 to-transparent" />
      </motion.div>

      {/* Bottom shadow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-16 bg-[#0CF2A0]/4 blur-3xl rounded-full pointer-events-none" />
    </footer>
  );
};
