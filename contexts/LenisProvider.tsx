"use client";

import { ReactNode } from "react";

import { ReactLenis } from "lenis/react";

export const LenisProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: true,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisProvider;
