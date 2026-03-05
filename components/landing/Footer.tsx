"use client";

import { Github, Linkedin, Mail, Twitter } from "lucide-react";

import { AnimatedFooter } from "../common/AnimatedFooter";

const socialLinks = [
  {
    icon: <Twitter className="h-5 w-5" />,
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    icon: <Linkedin className="h-5 w-5" />,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    icon: <Github className="h-5 w-5" />,
    href: "https://github.com",
    label: "GitHub",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    href: "mailto:hello@summarist.ai",
    label: "Email",
  },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
];

const Footer = () => {
  return (
    <AnimatedFooter
      brandName="Summarist"
      brandDescription="AI-powered PDF intelligence. Summarize, chat, and extract insights from any document in seconds."
      socialLinks={socialLinks}
      navLinks={navLinks}
      creatorName={"Rushikesh"}
    />
  );
};

export default Footer;
