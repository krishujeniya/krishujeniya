"use client"

import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
}

// Minimal ThemeProvider since we are forcing dark mode
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // You could add logic here if you wanted to support theme switching later
  // For now, it just renders children. The theme is applied via className in layout.tsx
  return <>{children}</>
}
