"use client"

import { AppCard } from "@/components/layout/app-card"
import { useDataChartTheme } from "@/components/providers/data-chart-theme-provider"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface SimplePieCardProps {
    disableLocalTheme?: boolean
    className?: string
    data?: Array<{ name: string; value: number }>
    height?: number
}

const defaultData: Array<{ name: string; value: number }> = [
    { name: "A", value: 400 },
    { name: "B", value: 300 },
    { name: "C", value: 300 },
    { name: "D", value: 200 },
]

export default function SimplePieCard({ disableLocalTheme, className = "", data = defaultData, height = 260 }: SimplePieCardProps) {
    const { palette } = useDataChartTheme()

    return (
        <AppCard disableLocalTheme={disableLocalTheme} className={`p-4 flex flex-col ${className}`}>
            <div>
                <ResponsiveContainer width="100%" height={height}>
                    <PieChart margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius="72%"
                            innerRadius="48%"
                            dataKey="value"
                            paddingAngle={2}
                            cornerRadius={12}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </AppCard>
    )
}
