import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCitizenStore } from "../../store/citizenStore";
import { 
  Compass, 
  Layers, 
  TrendingUp, 
  User, 
  ShieldCheck, 
  HelpCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useCitizenStore();
  const location = useLocation();

  const links = [
    { label: "Dashboard Hub", path: "/", icon: <Compass className="w-5 h-5 shrink-0" /> },
    { label: "Civic Services", path: "/services", icon: <Layers className="w-5 h-5 shrink-0" /> },
    { label: "Track Application", path: "/track", icon: <TrendingUp className="w-5 h-5 shrink-0" /> },
    { label: "National ID Profile", path: "/profile", icon: <User className="w-5 h-5 shrink-0" /> },
  ];

  if (user?.role === "Admin") {
    links.push({
      label: "Officer Terminal",
      path: "/admin",
      icon: <ShieldCheck className="w-5 h-5 shrink-0 text-amber-500" />,
    });
  }

  const baseLinkClass = "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 select-none cursor-pointer";
  const activeClass = "bg-[#2962ff] text-white";
  const inactiveClass = "text-white/70 hover:bg-white/5";

  const renderContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#ffc107] rounded flex items-center justify-center text-[#1a237e] font-bold text-sm shadow-inner transition">
            G
          </div>
          <span className="font-bold tracking-tight text-lg text-white">CitizenPortal</span>
        </div>
        <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Digital Government Services</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto w-full text-left">
          {links.map((link, idx) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={idx}
                to={link.path}
                onClick={() => onClose()}
                className={`${baseLinkClass} ${isActive ? activeClass : inactiveClass}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

      {/* Sidebar Verification Info Footer */}
      <div className="p-6 shrink-0 mt-auto">
        <div className="bg-white/5 p-4 rounded-xl text-left">
          <p className="text-xs text-white/60 mb-2">Verified Identity</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-sm font-medium text-white">{user?.name || "Unverified User"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar static placement */}
      <aside className="hidden lg:flex w-64 items-stretch shrink-0 bg-[#1a237e] text-white flex-col h-screen sticky top-0">
        {renderContent()}
      </aside>

      {/* Mobile Drawer Slide-in overlay using AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Slide-out body */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 left-0 w-64 bg-[#1a237e] text-white shadow-2xl flex flex-col max-h-screen"
            >
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {renderContent()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
