import type React from "react"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/dictionaries"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { UnifiedThemeProvider } from "@/components/providers/unified-theme-provider"
import { UnifiedChartThemeProvider } from "@/components/providers/unified-chart-theme-provider"
import { CardThemeProvider } from "@/components/providers/card-theme-provider"
import { FrostedEffectProvider } from "@/components/providers/frosted-effect-provider"
import { DesignConfigProvider } from "@/components/providers/design-config-provider"
import { LocaleProvider } from "@/components/providers/locale-provider"
import { EnhancedErrorBoundary } from "@/components/providers/enhanced-error-boundary"
import { PCDynamicBackground } from "@/components/theme/pc-dynamic-background"
import { PCLeftSidebar } from "@/components/navigation/pc-left-sidebar"
import { PCTopHeader } from "@/components/navigation/pc-top-header"

export default async function PCLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return (
    <LocaleProvider initialLocale={locale}>
      <ThemeProvider>
        <UnifiedThemeProvider>
          <UnifiedChartThemeProvider>
            <DesignConfigProvider>
              <CardThemeProvider>
                <FrostedEffectProvider>
                  <EnhancedErrorBoundary showDebugInfo={process.env.NODE_ENV === 'development'}>
                    <div className="min-h-screen relative overflow-hidden">
                      <PCDynamicBackground />

                      {/* Left Sidebar */}
                      <PCLeftSidebar dict={dict} locale={locale} />

                      {/* Main Content Area */}
                      <div className="pl-20 transition-all duration-300">
                        {/* Top Header */}
                        <PCTopHeader dict={dict} locale={locale} />

                        {/* Page Content */}
                        <main className="relative z-10 p-6 pt-20">
                          <div className="max-w-7xl mx-auto">{children}</div>
                        </main>
                      </div>
                    </div>
                  </EnhancedErrorBoundary>
                </FrostedEffectProvider>
              </CardThemeProvider>
            </DesignConfigProvider>
          </UnifiedChartThemeProvider>
        </UnifiedThemeProvider>
      </ThemeProvider>
    </LocaleProvider>
  )
}
