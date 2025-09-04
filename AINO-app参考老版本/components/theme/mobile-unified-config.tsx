"use client"

import { useState } from "react"
import { Settings, Palette, Brush, Layers, Zap, Eye, Shield, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { BottomDrawer } from "@/components/feedback/bottom-drawer"
import { cn } from "@/lib/utils"

// 导入现有的主题配置 hooks
import { useUnifiedConfig } from "@/hooks/use-unified-config"

// 导入配置数据
import { presets } from "@/config/theme"
import { cardThemePresets } from "@/config/card-theme"
import { chartPalettes } from "@/config/chart-theme"
import { dataChartPalettes } from "@/config/data-chart-palettes"

import type { CardThemeConfig } from "@/types"

// 导入国际化
import { useLocale } from "@/components/providers/locale-provider"
import { RadiusConfig } from "./radius-config"

export function MobileUnifiedConfig() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("background")
  const [globalFontColor, setGlobalFontColor] = useState("#4b5563")

  // 使用升级后的统一配置Hook
  const config = useUnifiedConfig()
  
  // 使用国际化
  const { locale } = useLocale()
  const isEnglish = locale === "en"

  const handleCardValueChange = (key: keyof CardThemeConfig, value: string) => {
    config.card.setTheme((prev) => ({ ...prev, [key]: value }))
  }

  const handleCardStyleChange = (style: "solid" | "frosted" | "none") => {
    config.card.setTheme((prev) => ({ ...prev, backgroundStyle: style }))
  }

  const handleCardOpacityChange = (opacity: "normal" | "high") => {
    config.card.setTheme((prev) => ({ ...prev, frostedOpacity: opacity }))
  }

  const handleGlobalFontColorChange = (color: string) => {
    // 更新本地状态
    setGlobalFontColor(color)
    
    // 更新全局字体颜色，影响整个应用
    document.documentElement.style.setProperty('--global-font-color', color)
    
    // 同时更新卡片主题的字体颜色，保持一致性
    config.card.setTheme((prev) => ({ ...prev, fontColor: color }))
    
    // 应用全局字体颜色到所有文本元素
    applyGlobalFontColor(color)
  }

  const applyGlobalFontColor = (color: string) => {
    // 创建或更新全局字体颜色的CSS规则
    let styleElement = document.getElementById('global-font-color-style')
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = 'global-font-color-style'
      document.head.appendChild(styleElement)
    }
    
    // 应用字体颜色到所有文本元素
    styleElement.textContent = `
      body, 
      .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500,
      h1, h2, h3, h4, h5, h6,
      p, span, div, label, button {
        color: ${color} !important;
      }
    `
  }

  return (
    <>
      {/* 配置入口按钮 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-white/60"
      >
        <Settings className="w-6 h-6 text-gray-700" />
        <span className="sr-only">{isEnglish ? "Open Configuration Panel" : "打开配置面板"}</span>
      </Button>

      {/* 底部配置面板 */}
      <BottomDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={isEnglish ? "Configuration Panel" : "配置面板"}
      >
        <div className="h-full flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-6 flex-shrink-0">
              <TabsTrigger value="background" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                {isEnglish ? "Background" : "背景配置"}
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Brush className="w-4 h-4" />
                {isEnglish ? "Content" : "内容配置"}
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                {isEnglish ? "Advanced" : "高级配置"}
              </TabsTrigger>
            </TabsList>

            {/* 背景配置标签页 - 保持现有功能完全不变 */}
            <TabsContent value="background" className="space-y-6 flex-1 overflow-y-auto px-4 pb-8">
                  {/* 背景颜色预设 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Background Color" : "背景颜色"}</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {presets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => config.theme.applyPreset(preset.colors)}
                          className="flex flex-col items-center justify-center p-2 space-y-1 rounded-lg hover:bg-gray-100/50 transition-colors"
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

                  {/* 自定义颜色 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Custom Colors" : "自定义颜色"}</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500 mb-2 block">{isEnglish ? "Primary" : "主色"}</Label>
                        <div className="relative">
                          <input
                            type="color"
                            value={config.theme.primaryColor}
                            onChange={(e) => config.theme.updateColor(1, e.target.value)}
                            className="w-full h-12 rounded-lg border border-gray-200 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-2 block">{isEnglish ? "Secondary" : "次色"}</Label>
                        <div className="relative">
                          <input
                            type="color"
                            value={config.theme.secondaryColor}
                            onChange={(e) => config.theme.updateColor(2, e.target.value)}
                            className="w-full h-12 rounded-lg border border-gray-200 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-2 block">{isEnglish ? "Accent" : "强调色"}</Label>
                        <div className="relative">
                          <input
                            type="color"
                            value={config.theme.accentColor}
                            onChange={(e) => config.theme.updateColor(3, e.target.value)}
                            className="w-full h-12 rounded-lg border border-gray-200 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 字体配置 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Font" : "字体"}</Label>
                    <Select defaultValue="system-ui">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={isEnglish ? "Select font" : "选择字体"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system-ui">System UI</SelectItem>
                        <SelectItem value="geist">Geist Sans</SelectItem>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 字体大小配置 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Font Size" : "字体大小"}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'small', name: isEnglish ? 'Small' : '小', scale: 0.8 },
                        { key: 'normal', name: isEnglish ? 'Normal' : '正常', scale: 1.0 },
                        { key: 'large', name: isEnglish ? 'Large' : '大', scale: 1.2 }
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => {
                            console.log("Font size button clicked:", option.key)
                            console.log("Current config:", config.fontSize)
                            config.fontSize.setPreset(option.key as any)
                            console.log("Font size preset set to:", option.key)
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 space-y-1 rounded-lg border transition-colors",
                            config.fontSize.current.current === option.key
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-gray-50/50 border-gray-200/60 hover:bg-gray-100/50"
                          )}
                          title={`${option.name} (${Math.round(option.scale * 100)}%)`}
                        >
                          <div className="text-lg font-semibold">{option.name}</div>
                          <div className="text-xs opacity-80">{Math.round(option.scale * 100)}%</div>
                        </button>
                      ))}
                    </div>
                    {config.fontSize.current.current !== "normal" && (
                      <div className="mt-2 text-xs text-gray-500 text-center">
                        {isEnglish ? "Current" : "当前"}：{config.fontSize.current.name} ({Math.round(config.fontSize.current.scale * 100)}%)
                      </div>
                    )}
                  </div>

                  {/* 全局字体颜色 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Global Font Color" : "全局字体颜色"}</Label>
                    <div className="relative">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-xl border border-gray-200/60 hover:bg-gray-100/50 transition-colors">
                        <div className="relative">
                          <div
                            className="w-10 h-10 rounded-xl border-2 border-white shadow-sm ring-1 ring-gray-200/50"
                            style={{ backgroundColor: globalFontColor }}
                          />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">{isEnglish ? "Global Font Color" : "全局字体颜色"}</div>
                          <div className="text-xs text-gray-500">影响整个应用</div>
                        </div>
                        <input
                          type="color"
                          value={globalFontColor}
                          onChange={(e) => handleGlobalFontColorChange(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          title={isEnglish ? "Select global font color" : "选择全局字体颜色"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 图表颜色主题 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Chart Color Theme" : "图表颜色主题"}</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {chartPalettes.map((palette) => (
                        <button
                          key={palette.name}
                          onClick={() => config.chart.applyPalette(palette.name)}
                          className="flex flex-col items-center justify-center p-2 space-y-1 rounded-lg hover:bg-gray-100/50 transition-colors"
                          title={palette.name}
                        >
                          <div
                            className="w-8 h-8 rounded-lg border border-gray-200"
                            style={{ backgroundColor: palette.colors[0] }}
                          />
                          <span className="text-xs text-gray-600">{palette.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* 内容配置标签页 - 保持现有功能完全不变 */}
                <TabsContent value="content" className="space-y-6 flex-1 overflow-y-auto px-4 pb-8">
                  {/* 卡片预设 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Card Presets" : "卡片预设"}</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {config.card.cardThemePresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => config.card.applyPreset(preset.config)}
                          className="flex flex-col items-center justify-center p-2 space-y-1 rounded-lg hover:bg-gray-100/50 transition-colors"
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

                  {/* 卡片样式配置 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Card Style" : "卡片样式"}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'solid', name: isEnglish ? 'Solid' : '实心', icon: '■' },
                        { key: 'frosted', name: isEnglish ? 'Frosted' : '毛玻璃', icon: '◆' },
                        { key: 'none', name: isEnglish ? 'None' : '无', icon: '○' }
                      ].map((style) => (
                        <button
                          key={style.key}
                          onClick={() => handleCardStyleChange(style.key as any)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 space-y-1 rounded-lg border transition-colors",
                            config.card.theme.backgroundStyle === style.key
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-gray-50/50 border-gray-200/60 hover:bg-gray-100/50"
                          )}
                        >
                          <div className="text-lg">{style.icon}</div>
                          <div className="text-xs">{style.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 毛玻璃透明度配置 */}
                  {config.card.theme.backgroundStyle === 'frosted' && (
                    <div>
                      <Label className="text-gray-600 mb-3 block">{isEnglish ? "Frosted Opacity" : "毛玻璃透明度"}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'normal', name: isEnglish ? 'Normal' : '正常' },
                          { key: 'high', name: isEnglish ? 'High' : '高' }
                        ].map((opacity) => (
                          <button
                            key={opacity.key}
                            onClick={() => handleCardOpacityChange(opacity.key as any)}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 space-y-1 rounded-lg border transition-colors",
                              config.card.theme.frostedOpacity === opacity.key
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-gray-50/50 border-gray-200/60 hover:bg-gray-100/50"
                            )}
                          >
                            <div className="text-xs">{opacity.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}



                  {/* 数据图表主题 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Data Chart Theme" : "数据图表主题"}</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {dataChartPalettes.map((palette) => (
                        <button
                          key={palette.name}
                          onClick={() => config.dataChart.applyPalette(palette.name)}
                          className="flex flex-col items-center justify-center p-2 space-y-1 rounded-lg hover:bg-gray-100/50 transition-colors"
                          title={palette.name}
                        >
                          <div
                            className="w-8 h-8 rounded-lg border border-gray-200"
                            style={{ backgroundColor: palette.colors[0] }}
                          />
                          <span className="text-xs text-gray-600">{palette.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 全局边角配置 - 新增 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block flex items-center gap-2">
                      <Square className="w-4 h-4" />
                      {isEnglish ? "Global Radius" : "全局边角"}
                    </Label>
                    <RadiusConfig />
                  </div>
                </TabsContent>

                {/* 新增：高级配置标签页 */}
                <TabsContent value="advanced" className="space-y-6 flex-1 overflow-y-auto px-4 pb-8">
                  {/* 语义令牌配置 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Semantic Context" : "语义上下文"}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'default', name: isEnglish ? 'Default' : '默认' },
                        { key: 'high-contrast', name: isEnglish ? 'High Contrast' : '高对比度' }
                      ].map((context) => (
                        <button
                          key={context.key}
                          onClick={() => config.semantic.setContext(context.key)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 space-y-1 rounded-lg border transition-colors",
                            config.semantic.currentContext === context.key
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-gray-50/50 border-gray-200/60 hover:bg-gray-100/50"
                          )}
                        >
                          <div className="text-xs">{context.name}</div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      {isEnglish ? "Current" : "当前"}：{config.semantic.currentContext}
                    </div>
                  </div>

                  {/* 组件变体配置 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Component Variants" : "组件变体"}</Label>
                    <div className="space-y-3">
                      {['button', 'input', 'card', 'navigation'].map((component) => (
                        <div key={component} className="p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
                          <div className="text-sm font-medium text-gray-800 mb-2 capitalize">{component}</div>
                          <div className="text-xs text-gray-500">
                            {isEnglish ? "Available variants:" : "可用变体:"} {
                              Object.keys(config.variants.getComponentVariants(component)?.variant || {}).join(', ')
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 动画配置 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Animation Presets" : "动画预设"}</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {['fade', 'slide', 'scale', 'bounce'].map((animation) => (
                        <button
                          key={animation}
                          className="flex flex-col items-center justify-center p-2 space-y-1 rounded-lg bg-gray-50/50 border border-gray-200/60 hover:bg-gray-100/50 transition-colors"
                          title={animation}
                        >
                          <Zap className="w-4 h-4 text-gray-600" />
                          <span className="text-xs text-gray-600 capitalize">{animation}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 可访问性配置 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Accessibility" : "可访问性"}</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-800">{isEnglish ? "High Contrast Mode" : "高对比度模式"}</span>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-800">{isEnglish ? "Reduced Motion" : "减少动画"}</span>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  {/* 配置导出导入 */}
                  <div>
                    <Label className="text-gray-600 mb-3 block">{isEnglish ? "Configuration" : "配置管理"}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const configData = config.importExport.export()
                          // 这里可以实现下载功能
                          console.log('Export config:', configData)
                        }}
                        className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-800">{isEnglish ? "Export" : "导出"}</span>
                      </button>
                      <button
                        onClick={() => {
                          // 这里可以实现导入功能
                          console.log('Import config clicked')
                        }}
                        className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">{isEnglish ? "Import" : "导入"}</span>
                      </button>
                    </div>
                  </div>
                </TabsContent>
          </Tabs>
        </div>
      </BottomDrawer>
    </>
  )
}
