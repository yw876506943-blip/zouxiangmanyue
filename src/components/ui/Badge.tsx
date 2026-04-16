import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning";
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-lavender-100 text-lavender-500": variant === "default",
          "bg-slate-100 text-slate-600": variant === "secondary",
          "border border-slate-200 text-slate-800": variant === "outline",
          "bg-emerald-100 text-emerald-600": variant === "success",
          "bg-amber-100 text-amber-600": variant === "warning",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
