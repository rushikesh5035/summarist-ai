import React from "react";

import { FileText } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 24, className = "" }) => {
  return (
    <FileText
      className={cn("text-[#0CF2A0]", className)}
      width={size}
      height={size}
    />
  );
};

export default Logo;
