"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import type React from "react"
import { useChartTheme } from "@/components/providers/unified-chart-theme-provider"
import { useFrostedEffect } from "@/components/providers/frosted-effect-provider"

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary"
}

function getContrastColor(hexColor: string): string {
  if (!hexColor.startsWith("#")) return "hsl(var(--foreground))"
  const r = Number.parseInt(hexColor.slice(1, 3), 16)
  const g = Number.parseInt(hexColor.slice(3, 5), 16)
  const b = Number.parseInt(hexColor.slice(5, 7), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "hsl(var(--foreground))" : "hsl(var(--background))"
}

export function PillButton({ className, variant = "default", ...props }: PillButtonProps) {
  const { palette } = useChartTheme()
  const { isFrosted } = useFrostedEffect()
  const primaryColor = palette[0] || "hsl(var(--primary))"
  const textColorForPrimary = useMemo(() => getContrastColor(primaryColor), [primaryColor])

  const baseStyles =
    "px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"

  const frostedBaseStyles = isFrosted ? "backdrop-blur-sm border border-white/40 shadow-lg" : "shadow-md"

  if (variant === "primary") {
    return (
      <button
        className={cn(baseStyles, frostedBaseStyles, "focus:ring-2", className)}
        style={
          {
            backgroundColor: isFrosted ? `${primaryColor}B3` : primaryColor, // 70% opacity
            color: textColorForPrimary,
            "--tw-ring-color": primaryColor,
          } as React.CSSProperties
        }
        {...props}
      />
    )
  }

  return (
    <button
      className={cn(
        baseStyles,
        frostedBaseStyles,
        isFrosted ? "bg-white/60 text-gray-900" : "bg-white text-black hover:bg-gray-50",
        "focus:ring-gray-400",
        className,
      )}
      {...props}
    />
  )
}
