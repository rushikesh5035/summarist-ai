"use client";

import React from "react";

import Link from "next/link";

import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import Logo from "./Logo";

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
        className
      )}
    >
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
          <div className="flex flex-col items-center text-center">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 max-w-md"
            >
              <Link href={"/"}>
                <div className="mb-4 flex items-center justify-center gap-2.5">
                  <div className="flex items-center justify-center">
                    <Logo size={35} />
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-white">
                    {brandName}
                  </span>
                </div>
              </Link>
              <p className="leading-relaxed text-gray-500">
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
                className="mb-35 flex flex-wrap items-center justify-center gap-x-6 gap-y-9"
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
                      className="text-sm text-gray-500 transition-colors duration-200 hover:text-[#0CF2A0]"
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
            className="flex flex-col items-center justify-between gap-3 border-t border-white/6 py-6 sm:flex-row"
          >
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            <Link
              href={"https://github.com/rushikesh5035/summarist-ai"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 transition-colors hover:text-[#0CF2A0]"
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
        className="pointer-events-none absolute right-0 bottom-12 left-0 flex justify-center overflow-hidden select-none"
      >
        <span className="text-[12vw] leading-none font-black tracking-tighter whitespace-nowrap text-white/2 md:text-[10vw]">
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
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-16 w-[60%] -translate-x-1/2 rounded-full bg-[#0CF2A0]/4 blur-3xl" />
    </footer>
  );
};
