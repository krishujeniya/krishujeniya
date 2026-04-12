"use client"

import * as React from "react"

// Dark mode is hardcoded via className="dark" on <body> in layout.tsx.
// This wrapper exists as a future extension point for theme switching.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
