"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { UnifiedChartThemeProvider } from "@/components/providers/unified-chart-theme-provider"
import { CardThemeProvider } from "@/components/providers/card-theme-provider"
import { FrostedEffectProvider } from "@/components/providers/frosted-effect-provider"
import { DesignConfigProvider } from "@/components/providers/design-config-provider"
import { LocaleProvider } from "@/components/providers/locale-provider"
import { EnhancedErrorBoundary } from "@/components/providers/enhanced-error-boundary"
import { DynamicBackground } from "@/components/theme/dynamic-background"
import { MobileUnifiedConfig } from "@/components/theme/mobile-unified-config"
import { cn } from "@/lib/utils"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import type { Locale } from "@/lib/dictionaries"
import { usePathname } from "next/navigation"

// 新增设计系统提供者
import { DesignTokensProvider } from "@/components/providers/design-tokens-provider"
import { SemanticTokensProvider } from "@/components/providers/semantic-tokens-provider"

const inter = Inter({ subsets: ["latin"] })

function DemoAwareBottomNavigation({ dict }: { dict: any }) {
  const pathname = usePathname()

  // 如果是Demo页面、PC页面或组件页面，不显示底部导航（这些页面有自己的专用导航或不需要导航）
  if (pathname.includes("/demo/") || pathname.includes("/pc") || pathname.includes("/components/")) {
    return null
  }

  return <BottomNavigation dict={dict} />
}

export function LayoutClient({
  children,
  dict,
  locale,
}: Readonly<{
  children: React.ReactNode
  dict: any
  locale: Locale
}>) {
  return (
    <div className={cn("min-h-screen font-sans antialiased", inter.className)}>
      <LocaleProvider initialLocale={locale}>
        {/* 新增设计系统提供者 - 在最外层，确保所有组件都能访问 */}
        <DesignTokensProvider>
          <SemanticTokensProvider>
            <ThemeProvider>
              <UnifiedChartThemeProvider>
                <DesignConfigProvider>
                  <CardThemeProvider>
                    <FrostedEffectProvider>
                      <EnhancedErrorBoundary showDebugInfo={process.env.NODE_ENV === 'development'}>
                        <div className="relative min-h-screen overflow-hidden">
                          <DynamicBackground />
                          <main className="relative z-10">{children}</main>
                          <DemoAwareBottomNavigation dict={dict.bottomNav} />
                          <MobileUnifiedConfig />
                        </div>
                      </EnhancedErrorBoundary>
                    </FrostedEffectProvider>
                  </CardThemeProvider>
                </DesignConfigProvider>
              </UnifiedChartThemeProvider>
            </ThemeProvider>
          </SemanticTokensProvider>
        </DesignTokensProvider>
      </LocaleProvider>
    </div>
  )
}
