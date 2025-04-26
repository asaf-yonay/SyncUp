import * as React from "react"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      backgroundColor: 'var(--card)',
      color: 'var(--card-foreground)',
      boxShadow: 'var(--shadow-sm)',
      ...props.style
    }}
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
    className={className}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-1)',
      padding: 'var(--spacing-6)',
      ...props.style
    }}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={className}
    style={{
      fontSize: 'var(--font-size-2xl)',
      fontWeight: 'var(--font-weight-semibold)',
      letterSpacing: '-0.025em',
      lineHeight: '1',
      ...props.style
    }}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{
      padding: 'var(--spacing-6)',
      paddingTop: 0,
      ...props.style
    }}
    {...props}
  />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent } 