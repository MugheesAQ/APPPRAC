import * as React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 px-6 lg:px-12 text-left z-10 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Government Info Card */}
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-3.5">
            <span className="w-5 h-5 rounded-md bg-[#ffc107] text-slate-950 flex items-center justify-center font-bold text-xxs">
              SG
            </span>
            <span className="text-sm font-extrabold uppercase tracking-widest text-slate-200">
              GovPortal Infrastructure
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            A secure digital gateway built for national civic accessibility. Seamlessly link registrations, update profiles, renew passport files, and consult status logs under central public transport, health, and commercial registries.
          </p>
        </div>

        {/* Dynamic Resource links columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6.5">
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3 select-none">
              Legal Matters
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><span className="hover:text-[#ffc107] transition cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-[#ffc107] transition cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-[#ffc107] transition cursor-pointer">Vulnerability Disclosure</span></li>
            </ul>
          </div>

          <div className="text-left text-xs font-semibold">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3 select-none">
              Services Network
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-[#ffc107] transition cursor-pointer">ACRA BizFile</span></li>
              <li><span className="hover:text-[#ffc107] transition cursor-pointer">ICA Immigration</span></li>
              <li><span className="hover:text-[#ffc107] transition cursor-pointer">MOH Health Core</span></li>
            </ul>
          </div>

          <div className="text-left text-xs font-semibold col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3 select-none">
              Hotlines
            </h4>
            <ul className="space-y-1 text-slate-400 font-mono">
              <li>Tech Support: <span className="text-slate-300">1-800-478-872</span></li>
              <li>Anti-Fraud Line: <span className="text-slate-300">1800-244-4444</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500">
        <p>© 2026 Government Technology Agency of Singapore. All Rights Reserved.</p>
        <div className="flex gap-4">
          <span className="hover:underline cursor-pointer">Privacy Controls</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Cookie Statement</span>
        </div>
      </div>
    </footer>
  );
};
