import React from "react";
import Image from "next/image";

export type LogoProps = {
  variant?: "default" | "full" | "full-light";
  width?: number;
  height?: number;
  className?: string;
};

const logoMap = {
  default: "/icon/logo.svg",
  full: "/icon/logo-full.svg",
  "full-light": "/icon/logo-full-light.svg",
};

export const Logo: React.FC<LogoProps> = ({
  variant = "default",
  width = 40,
  height = 40,
  className = "",
}) => {
  const src = logoMap[variant] || logoMap.default;
  return (
    <Image
      src={src}
      alt="Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
};
