"use client";

import React, { useState } from "react";

import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
  format?: "svg" | "png";
}

export const Logo: React.FC<LogoProps> = ({
  size = 24,
  className = "",
  format = "svg",
}) => {
  const [imgSrc, setImgSrc] = useState(
    format === "svg" ? "/logo.svg" : "/logo.png"
  );

  return (
    <Image
      src={imgSrc}
      alt="Summarist Logo"
      width={size}
      height={size}
      className={className}
      priority
      quality={100}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
      }}
      onError={() => {
        if (imgSrc === "/logo.svg") {
          setImgSrc("/logo.png");
        }
      }}
    />
  );
};

export default Logo;
