import type { PresetConfig, ColorConfig } from "@/types"

export const presets: PresetConfig[] = [
  { name: "纯白", colors: ["#ffffff", "#f8fafc", "#f1f5f9"] },
  { name: "天空蓝", colors: ["#ffffff", "#dbeafe", "#ecfeff"] },
  { name: "薄荷绿", colors: ["#ffffff", "#d1fae5", "#ecfdf5"] },
  { name: "粉色梦", colors: ["#ffffff", "#fce7f3", "#fdf2f8"] },
  { name: "淡紫色", colors: ["#ffffff", "#e9d5ff", "#f3e8ff"] },
]

export const initialColors: ColorConfig[] = [
  { id: 1, name: "主色", value: "#ffffff", enabled: true },
  { id: 2, name: "辅色", value: "#f8fafc", enabled: true },
  { id: 3, name: "点缀色", value: "#f1f5f9", enabled: true },
]
