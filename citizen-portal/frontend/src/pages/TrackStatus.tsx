import * as React from "react";
import { useCitizenStore } from "../store/citizenStore";
import { Application } from "../types";
import { 
  TrendingUp, 
  Clock, 
  MapPin, 
  AlertCircle, 
  ChevronRight, 
  CheckCircle,
  FileText
} from "lucide-react";
import { PageTransition, StaggerContainer, StaggerItem } from "../components/animations/PageTransition";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";

export default function TrackStatus() {
  const { applications, applicationsLoading, fetchApplications } = useCitizenStore();
  const [selectedApp, setSelectedApp] = React.useState<Application | null>(null);

  React.useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Sync selectedApp with updated applications list if applicable
  React.useEffect(() => {
    if (applications.length > 0 && !selectedApp) {
      setSelectedApp(applications[0]); // default to first record
    } else if (selectedApp) {
      const refreshed = applications.find((a) => a.id === selectedApp.id);
      if (refreshed) setSelectedApp(refreshed);
    }
  }, [applications, selectedApp]);

  const steps = ["Submitted", "Under Review", "Processing", "Approved/Rejected"];

  const getStepIndex = (status: string) => {
    if (status === "Submitted") return 0;
    if (status === "Under Review") return 1;
    if (status === "Processing") return 2;
    if (status === "Approved" || status === "Rejected") return 3;
    return -1;
  };

  const activeIndex = selectedApp ? getStepIndex(selectedApp.status) : -1;

  return (
    <PageTransition>
      <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900 text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col gap-6">
          
          <div className="border-b border-gray-150 dark:border-slate-800 pb-5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-gray-100 uppercase tracking-wider">
              Track Application Status
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Verify the exact status pipeline checkpoint of your active civic registrations and biometric audits.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: ACTIVE FILING DIRECTORY LISTS */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-1 select-none text-left">
                My Active Registries ({applications.length})
              </h3>

              {applicationsLoading ? (
                <div className="text-center p-8 bg-white dark:bg-slate-950 border border-gray-150 rounded-2xl animate-pulse text-xs text-slate-400">
                  Retrieving Government Indexing...
                </div>
              ) : applications.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400 bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-850">
                  No applications recorded in current database profiles.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`
                        p-4 rounded-2xl text-left border cursor-pointer transition duration-150 select-none
                        ${selectedApp?.id === app.id
                          ? "bg-blue-900 text-white border-blue-900 dark:bg-[#ffc107] dark:text-slate-950 dark:border-[#ffc107] shadow-xs"
                          : "bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-gray-100 dark:border-slate-850 hover:border-slate-300"}
                      `}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className={`text-[9px] font-bold font-mono uppercase px-1.5 py-0.5 rounded-sm ${selectedApp?.id === app.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300"}`}>
                          {app.id}
                        </span>
                        <span className={`text-[10px] font-semibold ${selectedApp?.id === app.id ? "text-blue-100 dark:text-slate-800" : "text-gray-400"}`}>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold truncate uppercase font-sans mt-1.5 leading-snug">
                        {app.serviceName}
                      </h4>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge status={app.status} className={selectedApp?.id === app.id ? "border-transparent bg-white/25 text-white" : ""} />
                        <ChevronRight className={`w-4 h-4 ${selectedApp?.id === app.id ? "text-white" : "text-slate-300"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: STEPPER PIPELINE VISUALIZATIONS */}
            <div className="lg:col-span-2">
              {selectedApp ? (
                <div className="flex flex-col gap-6">
                  {/* Detailed summary wrapper */}
                  <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-2xs text-left">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-850/60 pb-4 mb-5">
                      <div>
                        <span className="text-[10px] bg-blue-900/10 text-blue-900 dark:bg-[#ffc107]/10 dark:text-[#ffc107] font-extrabold px-2 py-0.5 rounded-sm font-mono uppercase">
                          {selectedApp.id}
                        </span>
                        <h3 className="text-sm font-extrabold text-[#1a237e] dark:text-[#2962ff] uppercase mt-1">
                          {selectedApp.serviceName}
                        </h3>
                      </div>
                      <Badge status={selectedApp.status} />
                    </div>

                    {/* DYNAMIC PIPELINE STEPPER BAR VISUALS */}
                    <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 py-6 md:px-4 text-center">
                      {/* Connection bar */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 dark:bg-slate-850 -translate-y-1/2 hidden md:block z-0"></div>
                      
                      {/* Active highlighted bar overlay */}
                      {activeIndex >= 0 && (
                        <div 
                          className="absolute top-1/2 left-0 h-1 bg-indigo-700 dark:bg-amber-500 -translate-y-1/2 hidden md:block z-0 transition-all duration-500"
                          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                        ></div>
                      )}

                      {steps.map((step, idx) => {
                        const isDone = idx < activeIndex;
                        const isActive = idx === activeIndex;
                        const isDecision = idx === 3;
                        
                        let stepStatus = step;
                        if (isDecision && selectedApp.status === "Rejected") {
                          stepStatus = "Rejected";
                        } else if (isDecision && selectedApp.status === "Approved") {
                          stepStatus = "Approved";
                        }

                        return (
                          <div key={idx} className="flex flex-row md:flex-col items-center gap-3 relative z-10 w-full md:w-auto">
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all shrink-0
                              ${isDone ? "bg-emerald-600 text-white" : ""}
                              ${isActive ? "bg-indigo-700 text-white dark:bg-amber-500 dark:text-slate-950 ring-4 ring-indigo-700/20 dark:ring-amber-500/20" : ""}
                              ${!isDone && !isActive ? "bg-white dark:bg-slate-900 text-gray-300 dark:text-gray-600 border border-gray-200 dark:border-slate-800" : ""}
                            `}>
                              {isDone ? "✓" : idx + 1}
                            </div>
                            <div className="text-left md:text-center">
                              <span className={`text-[11px] font-bold uppercase tracking-wide
                                ${isActive ? "text-indigo-800 dark:text-amber-500 font-extrabold" : "text-gray-400"}
                                ${isDone ? "text-emerald-700 dark:text-emerald-500" : ""}
                              `}>
                                {stepStatus}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Official Auditor comments block */}
                    <div className="mt-6 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-4 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                        Latest Officer Remark
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                        {selectedApp.remarks}
                      </p>
                      <span className="text-[10px] text-gray-400 block mt-2.5 font-semibold">
                        Last Activity Sync: {new Date(selectedApp.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic sequential status logs chronology */}
                  <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-2xs text-left">
                    <h4 className="text-xs font-black text-slate-900 dark:text-gray-200 uppercase tracking-widest mb-4">
                      Chronological Action Logs
                    </h4>
                    
                    <div className="flex flex-col gap-5 relative pl-4 border-l-2 border-gray-100 dark:border-slate-850">
                      {selectedApp.statusLogs.map((log, lidx) => (
                        <div key={lidx} className="relative">
                          {/* Chrono Node dot */}
                          <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-900 dark:bg-amber-500 ring-4 ring-white dark:ring-slate-950"></span>
                          
                          <div className="text-left py-0.5">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">
                                {log.status}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {new Date(log.date).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                              {log.remarks}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center text-sm text-gray-400 bg-white dark:bg-slate-950 rounded-2xl border border-gray-150 dark:border-slate-850 text-left">
                  Please select an active filing from your directory checklist.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
