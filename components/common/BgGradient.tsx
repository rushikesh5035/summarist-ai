import React from "react";

const BgGradient = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-3xl" />
    </div>
  );
};

export default BgGradient;
