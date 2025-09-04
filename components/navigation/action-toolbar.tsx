"use client"

import type React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Compass, Layers, Bell, ChevronUp } from "lucide-react"
import { useMemo } from "react"
import { useChartTheme } from "@/components/providers/unified-chart-theme-provider"

function getContrastColor(hexColor: string): string {
  if (!hexColor.startsWith("#")) return "hsl(var(--foreground))"
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "hsl(var(--foreground))" : "hsl(var(--background))"
}

export function ActionToolbar() {
  const { palette } = useChartTheme()
  const primaryColor = palette[0] || "#000000"
  const textColorForPrimary = useMemo(() => getContrastColor(primaryColor), [primaryColor])

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex items-center space-x-2 px-4 py-2 h-10 rounded-full shadow-md focus-visible:ring-2 focus-visible:ring-offset-2"
            style={
              {
                backgroundColor: primaryColor,
                color: textColorForPrimary,
                "--tw-ring-color": primaryColor,
              } as React.CSSProperties
            }
          >
            <Compass className="w-5 h-5" />
            <span className="text-sm font-semibold">Discover</span>
            <ChevronUp className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white/80 backdrop-blur-lg border-gray-200/60 rounded-xl">
          <DropdownMenuLabel>探索</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>热门</DropdownMenuItem>
          <DropdownMenuItem>最新</DropdownMenuItem>
          <DropdownMenuItem>推荐</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-10 h-10 bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
      >
        <Layers className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-10 h-10 bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
      >
        <Bell className="w-5 h-5" />
      </Button>

      <Avatar>
        <AvatarImage src="/generic-user-avatar.png" alt="User Avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  )
}
