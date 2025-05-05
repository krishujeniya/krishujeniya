import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm", // Base card styles
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Changed from div to h3 for better semantic structure
const CardTitle = React.forwardRef<
  HTMLHeadingElement, // Changed from HTMLDivElement
  React.HTMLAttributes<HTMLHeadingElement> // Changed from HTMLDivElement
>(({ className, ...props }, ref) => (
  <h3 // Changed from div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight", // Use existing styles, adjusted size in globals.css if needed
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement, // Changed from HTMLDivElement
  React.HTMLAttributes<HTMLParagraphElement> // Changed from HTMLDivElement
>(({ className, ...props }, ref) => (
  <p // Changed from div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Add card hover class utility for consistency
const cardHoverClasses = "transition-all duration-300 ease-in-out hover:shadow-lg hover:border-accent/50 hover:bg-card/90"; // Darken slightly on hover

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardHoverClasses }
