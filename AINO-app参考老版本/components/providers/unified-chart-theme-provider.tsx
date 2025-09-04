"use client"
import { createContext, useContext, useState, useMemo, type ReactNode } from "react"
import { chartPalettes } from "@/config/chart-theme"
import { dataChartPalettes } from "@/config/data-chart-palettes"

interface UnifiedChartThemeContextType {
  // 图表调色板
  chartPalette: string[]
  activeChartPaletteName: string
  applyChartPalette: (paletteName: string) => void
  
  // 数据图表调色板
  dataChartPalette: string[]
  activeDataChartPaletteName: string
  applyDataChartPalette: (paletteName: string) => void
}

const UnifiedChartThemeContext = createContext<UnifiedChartThemeContextType | undefined>(undefined)

export function UnifiedChartThemeProvider({ children }: { children: ReactNode }) {
  // 图表调色板状态
  const [activeChartPaletteName, setActiveChartPaletteName] = useState<string>(chartPalettes[0].name)
  
  // 数据图表调色板状态
  const [activeDataChartPaletteName, setActiveDataChartPaletteName] = useState<string>(dataChartPalettes[0].name)

  // 图表调色板方法
  const applyChartPalette = (paletteName: string) => {
    setActiveChartPaletteName(paletteName)
  }

  // 数据图表调色板方法
  const applyDataChartPalette = (paletteName: string) => {
    const newPalette = dataChartPalettes.find((p) => p.name === paletteName)
    if (newPalette) {
      setActiveDataChartPaletteName(paletteName)
    }
  }

  // 图表调色板计算
  const chartPalette = useMemo(() => {
    const activePalette = chartPalettes.find((p) => p.name === activeChartPaletteName)
    return activePalette ? activePalette.colors : chartPalettes[0].colors
  }, [activeChartPaletteName])

  // 数据图表调色板计算
  const dataChartPalette = useMemo(() => {
    const activePalette = dataChartPalettes.find((p) => p.name === activeDataChartPaletteName)
    return activePalette ? activePalette.colors : dataChartPalettes[0].colors
  }, [activeDataChartPaletteName])

  const value = useMemo(
    () => ({
      chartPalette,
      activeChartPaletteName,
      applyChartPalette,
      dataChartPalette,
      activeDataChartPaletteName,
      applyDataChartPalette,
    }),
    [chartPalette, activeChartPaletteName, dataChartPalette, activeDataChartPaletteName],
  )

  return <UnifiedChartThemeContext.Provider value={value}>{children}</UnifiedChartThemeContext.Provider>
}

// 兼容性Hook - 保持原有API
export function useChartTheme() {
  const context = useContext(UnifiedChartThemeContext)
  if (context === undefined) {
    throw new Error("useChartTheme must be used within a UnifiedChartThemeProvider")
  }
  return {
    palette: context.chartPalette,
    activePaletteName: context.activeChartPaletteName,
    applyPalette: context.applyChartPalette,
  }
}

export function useDataChartTheme() {
  const context = useContext(UnifiedChartThemeContext)
  if (context === undefined) {
    throw new Error("useDataChartTheme must be used within a UnifiedChartThemeProvider")
  }
  return {
    palette: context.dataChartPalette,
    activePaletteName: context.activeDataChartPaletteName,
    applyPalette: context.applyDataChartPalette,
  }
}

// 兼容性Provider - 保持原有API
// 注意：这些Provider只是别名，实际使用的是UnifiedChartThemeProvider
// 在布局中应该只使用UnifiedChartThemeProvider，这些是为了向后兼容
export function ChartThemeProvider({ children }: { children: ReactNode }) {
  // 直接渲染children，因为UnifiedChartThemeProvider已经在布局中
  return <>{children}</>
}

export function DataChartThemeProvider({ children }: { children: ReactNode }) {
  // 直接渲染children，因为UnifiedChartThemeProvider已经在布局中
  return <>{children}</>
}

// 新的统一Hook
export function useUnifiedChartTheme() {
  const context = useContext(UnifiedChartThemeContext)
  if (context === undefined) {
    throw new Error("useUnifiedChartTheme must be used within a UnifiedChartThemeProvider")
  }
  return context
}
