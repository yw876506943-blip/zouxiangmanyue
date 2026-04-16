import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lavender-400 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-gradient-to-r from-lavender-500 to-misty-500 text-white shadow-md hover:opacity-90": variant === "default",
            "border border-slate-200 bg-white/50 hover:bg-white/80 text-slate-800": variant === "outline",
            "hover:bg-slate-100/50 text-slate-700": variant === "ghost",
            "glass hover:bg-white/80 text-slate-800": variant === "glass",
            "h-10 px-4 py-2": size === "default",
            "h-8 rounded-xl px-3 text-xs": size === "sm",
            "h-12 rounded-2xl px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
