"use client";

import { cn } from "@/lib/utils";

interface HikaruLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon";
  className?: string;
}

const sizeConfig = {
  sm: { icon: "h-8 w-8", text: "text-lg", japanese: "text-[10px]" },
  md: { icon: "h-10 w-10", text: "text-xl", japanese: "text-xs" },
  lg: { icon: "h-12 w-12", text: "text-2xl", japanese: "text-sm" },
  xl: { icon: "h-16 w-16", text: "text-3xl", japanese: "text-base" },
};

export function HikaruLogo({
  size = "md",
  variant = "full",
  className,
}: HikaruLogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo Icon - Japanese Initials */}
      <div
        className={cn(
          "relative flex items-center justify-center bg-black text-white",
          config.icon,
        )}
        style={{ aspectRatio: "1" }}
      >
        {/* Main Japanese Character - 光 (Hikaru/Light) */}
        <span
          className="font-heading font-bold text-white"
          style={{
            fontSize:
              size === "sm"
                ? "16px"
                : size === "md"
                  ? "20px"
                  : size === "lg"
                    ? "24px"
                    : "32px",
          }}
        >
          光
        </span>
        {/* Red Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E10600]" />
      </div>

      {/* Full Logo Text */}
      {variant === "full" && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-heading font-bold tracking-tight text-black leading-none",
              config.text,
            )}
          >
            HIKARU BOUKEN
          </span>
          <span
            className={cn(
              "text-muted-foreground tracking-widest uppercase",
              config.japanese,
            )}
          >
            光る冒険
          </span>
        </div>
      )}
    </div>
  );
}

export function HikaruLogoMinimal({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center bg-black">
        <span className="text-lg font-bold text-white font-heading">光</span>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E10600]" />
      </div>
      <div className="hidden sm:flex flex-col">
        <span className="font-heading text-sm font-bold tracking-tight text-black leading-none">
          HIKARU BOUKEN
        </span>
        <span className="text-[9px] text-muted-foreground tracking-widest">
          光る冒険
        </span>
      </div>
    </div>
  );
}
