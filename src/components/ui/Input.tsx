import * as React from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon, type = "text", id, ...props }, ref) => {
    const inputId = id || `input-${Math.floor(Math.random() * 100000)}`;

    return (
      <div className="w-full text-left">
        <label
          htmlFor={inputId}
          className="block text-xs font-bold tracking-wide text-blue-900/90 dark:text-gray-300 mb-1.5 uppercase"
        >
          {label}
        </label>
        
        <div className="relative rounded-lg shadow-xs">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={`
              block w-full rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100
              border ${error ? "border-rose-500 focus:ring-rose-500" : "border-gray-200 dark:border-slate-800 focus:border-blue-800 dark:focus:border-[#ffc107] focus:ring-blue-800/20"}
              focus:ring-4 focus:outline-none transition-all py-2.5 pr-4
              ${icon ? "pl-10" : "pl-3.5"}
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-500 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
