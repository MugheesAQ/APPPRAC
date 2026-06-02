import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (location.pathname === "/") {
    return null; // Don't block screen space on home/dashboard landing
  }

  const capitalize = (s: string) => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ");
  };

  return (
    <nav className="shrink-0 flex items-center gap-1.5 py-3 px-6 lg:px-8 text-xs font-semibold text-gray-500 border-b border-gray-200 bg-[#f5f5f5] select-none text-left">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[#2962ff] text-gray-400 transition"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Gateway Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
            {last ? (
              <span className="text-[#212121] font-bold uppercase tracking-wider text-[11px]">
                {capitalize(value)}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-[#2962ff] transition"
              >
                {capitalize(value)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
