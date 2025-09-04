"use client"

import { ColorPicker } from "@/components/theme/color-picker"
import { LanguageSwitcher } from "@/components/theme/language-switcher"
import { CardThemePicker } from "@/components/theme/card-theme-picker"
import { ChartThemePicker } from "@/components/theme/chart-theme-picker"

interface BrowserHeaderProps {
  title: string
}

export function BrowserHeader({ title }: BrowserHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 h-16">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center space-x-2">
        <LanguageSwitcher />
        <ColorPicker />
        <CardThemePicker />
        <ChartThemePicker />
      </div>
    </header>
  )
}
