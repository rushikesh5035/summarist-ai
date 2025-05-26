"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme(); // Default to "light" if undefined

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right" // Set position to top-right
      style={
        {
          "--normal-bg": "var(--popover, #ffffff)", // Fallback to white
          "--normal-text": "var(--popover-foreground, #000000)", // Fallback to black
          "--normal-border": "var(--border, #e5e5e5)", // Fallback to light gray
          marginTop: "2.5rem", // Add top margin
          gap: "1rem", // Add spacing between toasts
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
