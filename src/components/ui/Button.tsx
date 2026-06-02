import * as React from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "amber";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading = false, children, ...props }, ref) => {
    // Styling dictionaries based on the modern, high-contrast Gov branding scheme
    const baseStyle = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer transform-gpu active:scale-95";
    
    const variants = {
      primary: "bg-gradient-to-r from-blue-900 to-indigo-950 text-white hover:opacity-95 shadow-md shadow-blue-950/20 hover:shadow-lg focus:ring-blue-700 font-semibold",
      secondary: "bg-[#ffc107] text-gray-950 hover:bg-[#e0a800] hover:shadow-md hover:shadow-amber-500/20 font-bold border border-amber-500/10",
      outline: "bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-850",
      ghost: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-indigo-950/25",
      danger: "bg-rose-700 text-white hover:bg-rose-800 hover:shadow-md hover:shadow-rose-600/10 focus:ring-rose-500",
      amber: "bg-amber-600 text-white hover:bg-amber-700 hover:shadow-md hover:shadow-amber-600/15 focus:ring-amber-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs tracking-wide",
      md: "px-5 py-2.5 text-sm tracking-wide",
      lg: "px-7 py-3.5 text-base font-semibold tracking-wide",
    };

    return (
      <motion.button
        ref={ref as any}
        whileHover={{ scale: 1.015, y: -0.5 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
