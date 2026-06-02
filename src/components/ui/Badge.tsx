import * as React from "react";

export type BadgeStatus = "Submitted" | "Under Review" | "Processing" | "Approved" | "Rejected" | "info" | "warning";

interface BadgeProps {
  status: BadgeStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = "" }) => {
  // Styles for government-standard status badges
  let bgClass = "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800";
  let pulse = false;

  switch (status) {
    case "Submitted":
      bgClass = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900";
      break;
    case "Under Review":
      bgClass = "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900";
      pulse = true;
      break;
    case "Processing":
      bgClass = "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900";
      pulse = true;
      break;
    case "Approved":
      bgClass = "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900";
      break;
    case "Rejected":
      bgClass = "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900";
      break;
    case "info":
      bgClass = "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-300";
      break;
    case "warning":
      bgClass = "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-300";
      break;
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border tracking-wide whitespace-nowrap
        ${bgClass}
        ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {status}
    </span>
  );
};
