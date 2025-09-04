"use client"

import { useState } from "react"
import { Palette } from "lucide-react"
import { useChartTheme } from "@/components/providers/chart-theme-provider"
import { useDataChartTheme } from "@/components/providers/data-chart-theme-provider"
import { chartPalettes } from "@/config/chart-theme"
import { dataChartPalettes } from "@/config/data-chart-palettes"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useFrostedEffect } from "@/components/providers/frosted-effect-provider"
import { SwitchControl } from "@/components/input/switch-control"

export function ChartThemePicker() {
  const [showPicker, setShowPicker] = useState(false)
  const { activePaletteName: activeChartPaletteName, applyPalette: applyChartPalette } = useChartTheme()
  const { activePaletteName: activeDataChartPaletteName, applyPalette: applyDataChartPalette } = useDataChartTheme()
  const { isFrosted, setIsFrosted } = useFrostedEffect()

  return (
    <>
      <div className="relative z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPicker(!showPicker)}
          className="rounded-full w-10 h-10 bg-white/50 backdrop-blur-md"
        >
          <Palette className="w-5 h-5 text-gray-700" />
          <span className="sr-only">Toggle Data Component Theme Picker</span>
        </Button>
      </div>

      {showPicker && (
        <div className="absolute top-12 right-0 z-50 w-80">
          <Card className="bg-white/90 backdrop-blur-xl shadow-xl border-white/60 rounded-3xl">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-800">数据组件主题</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-600 mb-3 block">组件强调色</Label>
                <div className="grid grid-cols-5 gap-2">
                  {chartPalettes.map((palette) => (
                    <button
                      key={palette.name}
                      onClick={() => applyChartPalette(palette.name)}
                      className={cn(
                        "flex flex-col items-center justify-center p-1 space-y-1 rounded-lg hover:bg-gray-100/50 transition-colors",
                        activeChartPaletteName === palette.name && "bg-blue-100/50",
                      )}
                      title={palette.name}
                    >
                      <div className="flex items-center">
                        {palette.colors.slice(0, 3).map((color, index) => (
                          <div
                            key={color}
                            className="h-5 w-5 rounded-full border-2 border-white"
                            style={{ backgroundColor: color, marginLeft: index > 0 ? "-0.5rem" : 0 }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">{palette.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-gray-600 mb-3 block">数据图表颜色预设</Label>
                <div className="grid grid-cols-5 gap-2">
                  {dataChartPalettes.map((palette) => (
                    <button
                      key={palette.name}
                      onClick={() => applyDataChartPalette(palette.name)}
                      className={cn(
                        "flex flex-col items-center justify-center p-1 space-y-1 rounded-lg hover:bg-gray-100/50 transition-colors",
                        activeDataChartPaletteName === palette.name && "bg-blue-100/50",
                      )}
                      title={palette.name}
                    >
                      <div className="flex items-center justify-center w-full">
                        {palette.colors.slice(0, 5).map((color, index) => (
                          <div
                            key={color}
                            className="h-4 w-4 rounded-full border-2 border-white"
                            style={{
                              backgroundColor: color,
                              marginLeft: index > 0 ? "-0.4rem" : 0,
                              zIndex: 5 - index,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 mt-1">{palette.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-gray-200/60">
                <Label className="text-gray-600 mb-2 block">全局效果</Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="frosted-switch" className="text-sm font-medium text-gray-700 cursor-pointer">
                    毛玻璃效果
                  </Label>
                  <SwitchControl checked={isFrosted} onCheckedChange={setIsFrosted} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
