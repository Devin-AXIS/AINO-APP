"use client"

import { useState } from "react"
import { Palette } from 'lucide-react'
import { useTheme } from "@/components/providers/theme-provider"
import { presets } from "@/config/theme"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function ColorPicker() {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const { colors, updateColor, toggleColor, applyPreset } = useTheme()

  return (
    <>
      <div className="relative z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="rounded-full w-10 h-10 bg-white/50 backdrop-blur-md"
        >
          <Palette className="w-5 h-5 text-gray-700" />
          <span className="sr-only">Toggle Color Picker</span>
        </Button>
      </div>

      {showColorPicker && (
        <div className="absolute top-12 right-0 z-50 w-80">
          <Card className="bg-white/90 backdrop-blur-xl shadow-xl border-white/60 rounded-3xl">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-800">自定义配色</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-600 mb-3 block">预设方案</Label>
                <div className="grid grid-cols-5 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset.colors)}
                      className="flex flex-col items-center justify-center p-1 space-y-1 rounded-lg hover:bg-gray-100/50 transition-colors"
                      title={preset.name}
                    >
                      <div
                        className="w-8 h-8 rounded-lg border border-gray-200"
                        style={{
                          background: `linear-gradient(135deg, ${preset.colors[0]} 0%, ${preset.colors[1]} 50%, ${preset.colors[2]} 100%)`,
                        }}
                      />
                      <span className="text-xs text-gray-600">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-gray-600 mb-3 block">自定义颜色</Label>
                <div className="space-y-3">
                  {colors.map((color) => (
                    <div key={color.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Switch
                          id={`switch-${color.id}`}
                          checked={color.enabled}
                          onCheckedChange={() => toggleColor(color.id)}
                        />
                        <Label htmlFor={`switch-${color.id}`} className="text-gray-700 cursor-pointer">
                          {color.name}
                        </Label>
                      </div>
                      <div className="relative flex items-center">
                        <div
                          className="w-8 h-8 rounded-lg border border-gray-200"
                          style={{ backgroundColor: color.value }}
                        />
                        <input
                          type="color"
                          value={color.value}
                          onChange={(e) => updateColor(color.id, e.target.value)}
                          disabled={!color.enabled}
                          className="absolute right-0 w-8 h-8 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          title={`选择${color.name}颜色`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
