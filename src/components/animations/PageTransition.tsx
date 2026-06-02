import * as React from "react";
import { motion } from "motion/react";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} // smooth ease-out curve
      className="w-full h-full flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer: React.FC<{ children: React.ReactNode; delayChildren?: number }> = ({ 
  children, 
  delayChildren = 0.05 
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.07,
            delayChildren
          }
        }
      }}
      className="w-full flex flex-col gap-4"
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs animate-pulse flex flex-col gap-4">
      <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-1/3"></div>
      <div className="h-9 bg-gray-200 dark:bg-slate-800 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-2/3"></div>
      <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded-md w-full mt-2"></div>
    </div>
  );
};
