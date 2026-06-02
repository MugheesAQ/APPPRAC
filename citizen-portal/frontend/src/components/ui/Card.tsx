import * as React from "react";
import { motion } from "motion/react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className = "",
  children,
  onClick,
  hoverEffect = true,
}) => {
  const isClickable = !!onClick;

  return (
    <motion.div
      whileHover={hoverEffect || isClickable ? { y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800/80 rounded-xl p-5
        ${isClickable ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
