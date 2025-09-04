"use client"

import { useState } from "react"
import { Brush } from "lucide-react"
import { useCardTheme } from "@/components/providers/card-theme-provider"
import { cardThemePresets } from "@/config/card-theme"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CardThemeConfig } from "@/types"
import { cn } from "@/lib/utils"

export function CardThemePicker() {
  const [showPicker, setShowPicker] = useState(false)
  const { theme, setTheme, applyPreset } = useCardTheme()

  const handleValueChange = (key: keyof CardThemeConfig, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }))
  }

  const handleStyleChange = (style: "solid" | "frosted" | "none") => {
    setTheme((prev) => ({ ...prev, backgroundStyle: style }))
  }

  const handleOpacityChange = (opacity: "normal" | "high") => {
    setTheme((prev) => ({ ...prev, frostedOpacity: opacity }))
  }

  return (
    <>
      <div className="relative z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPicker(!showPicker)}
          className="rounded-full w-10 h-10 bg-white/50 backdrop-blur-md"
        >
          <Brush className="w-5 h-5 text-gray-700" />
          <span className="sr-only">Toggle Card Theme Picker</span>
        </Button>
      </div>

      {showPicker && (
        <div className="absolute top-12 right-0 z-50 w-80">
          <Card className="bg-white/90 backdrop-blur-xl shadow-xl border-white/60 rounded-3xl">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-800">卡片主题</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Card Theme Presets */}
              <div>
                <Label className="text-gray-600 mb-3 block">卡片预设</Label>
                <div className="grid grid-cols-4 gap-2">
                  {cardThemePresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset.config)}
                      className="flex flex-col items-center justify-center p-1 space-y-1 rounded-lg hover:bg-gray-100/50 transition-colors"
                      title={preset.name}
                    >
                      <div
                        className="w-12 h-8 rounded-lg border"
                        style={{
                          backgroundColor: preset.config.background,
                        }}
                      />
                      <span className="text-xs text-gray-600">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Card Theme */}
              <div className="space-y-4 pt-4 border-t border-gray-200/60">
                <Label className="text-gray-600 mb-2 block">自定义卡片</Label>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">背景效果</Label>
                  <div className="flex items-center p-1 bg-gray-100/80 rounded-full">
                    <button
                      onClick={() => handleStyleChange("solid")}
                      className={cn(
                        "px-3 py-1 text-xs rounded-full transition-all",
                        theme.backgroundStyle === "solid" ? "bg-white shadow" : "text-gray-500",
                      )}
                    >
                      纯色
                    </button>
                    <button
                      onClick={() => handleStyleChange("frosted")}
                      className={cn(
                        "px-3 py-1 text-xs rounded-full transition-all",
                        theme.backgroundStyle === "frosted" ? "bg-white shadow" : "text-gray-500",
                      )}
                    >
                      毛玻璃
                    </button>
                    <button
                      onClick={() => handleStyleChange("none")}
                      className={cn(
                        "px-3 py-1 text-xs rounded-full transition-all",
                        theme.backgroundStyle === "none" ? "bg-white shadow" : "text-gray-500",
                      )}
                    >
                      无背景
                    </button>
                  </div>
                </div>

                {theme.backgroundStyle === "frosted" && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">透明度</Label>
                    <div className="flex items-center p-1 bg-gray-100/80 rounded-full">
                      <button
                        onClick={() => handleOpacityChange("normal")}
                        className={cn(
                          "px-3 py-1 text-xs rounded-full transition-all",
                          theme.frostedOpacity === "normal" || !theme.frostedOpacity
                            ? "bg-white shadow"
                            : "text-gray-500",
                        )}
                      >
                        正常
                      </button>
                      <button
                        onClick={() => handleOpacityChange("high")}
                        className={cn(
                          "px-3 py-1 text-xs rounded-full transition-all",
                          theme.frostedOpacity === "high" ? "bg-white shadow" : "text-gray-500",
                        )}
                      >
                        高
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label className="text-sm">背景颜色</Label>
                  <input
                    type="color"
                    value={theme.background}
                    onChange={(e) => handleValueChange("background", e.target.value)}
                    className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">字体颜色</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.fontColor}
                      onChange={(e) => handleValueChange("fontColor", e.target.value)}
                      className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                    />
                    <span className="text-xs text-gray-500">标题自动变深</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">字体</Label>
                  <Select value={theme.fontFamily} onValueChange={(v) => handleValueChange("fontFamily", v)}>
                    <SelectTrigger className="w-[180px] h-8 text-xs">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system-ui, sans-serif">System UI</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="Courier New, monospace">Courier New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
