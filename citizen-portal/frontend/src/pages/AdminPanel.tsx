import * as React from "react";
import { useCitizenStore } from "../store/citizenStore";
import { Application, AdminAnalytics } from "../types";
import { 
  ShieldCheck, 
  Database, 
  Terminal, 
  FileCheck, 
  X, 
  Award,
  CircleDot,
  Trash2,
  Info,
  ChevronRight
} from "lucide-react";
import { PageTransition, StaggerContainer, StaggerItem } from "../components/animations/PageTransition";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { showToast } from "../components/ui/Toast";

export default function AdminPanel() {
  const { user, applications, applicationsLoading, fetchApplications, updateApplicationStatus } = useCitizenStore();
  
  // Local active stats
  const [analytics, setAnalytics] = React.useState<AdminAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = React.useState(true);

  // Manage Status Actions Modals
  const [selectedApp, setSelectedApp] = React.useState<Application | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = React.useState(false);
  const [decision, setDecision] = React.useState<"Approved" | "Rejected" | "Processing" | "Under Review">("Processing");
  const [remarks, setRemarks] = React.useState("");
  const [updating, setUpdating] = React.useState(false);

  const fetchAnalytics = React.useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const resp = await fetch("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("gov_token")}` }
      });
      const data = await resp.json();
      if (resp.ok) {
        setAnalytics(data.analytics);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingAnalytics(false);
  }, []);

  React.useEffect(() => {
    // Role clearance security wall
    if (user?.role !== "Admin") {
      showToast("Access log flagged. This is a secure Administrative node.", "error", "Clearance Required");
      return;
    }

    fetchApplications();
    fetchAnalytics();
  }, [user, fetchApplications, fetchAnalytics]);

  const handleActionClick = (app: Application) => {
    setSelectedApp(app);
    setRemarks("");
    // Default decision matching current
    setDecision(app.status === "Submitted" ? "Under Review" : "Processing");
    setIsActionModalOpen(true);
  };

  const handleStatusCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (!remarks.trim()) {
      showToast("Please provide official administrative auditing remarks.", "warning", "Remarks Required");
      return;
    }

    setUpdating(true);
    const success = await updateApplicationStatus(selectedApp.id, decision, remarks.trim());
    setUpdating(false);

    if (success) {
      setIsActionModalOpen(false);
      showToast(`Filing record ${selectedApp.id} was successfully updated.`, "success", "Filing Updated");
      // Auto refresh analytic dashboards
      await fetchApplications();
      await fetchAnalytics();
    } else {
      showToast("Session security reject or update offline error.", "error", "Filing Update Failed");
    }
  };

  if (user?.role !== "Admin") {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50 dark:bg-slate-900 text-slate-400">
        <div className="max-w-md bg-white p-6 border rounded-2xl text-center flex flex-col items-center gap-3">
          <Terminal className="w-8 h-8 text-rose-600" />
          <h3 className="font-extrabold text-slate-800">Clearance Missing</h3>
          <p className="text-xs">
            GovTech Hive firewalls restrict standard profiles from auditing this system node. Please login using officer credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900 text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col gap-6">

          {/* Section banner */}
          <div className="border-b border-gray-150 dark:border-slate-800 pb-5 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-gray-150 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-6.5 h-6.5 text-[#ffc107]" />
                Officer Auditing Terminal
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Oversee incoming pipeline queues, execute status shifts, inspect Redis in-memory hits, and review system audit trails.
              </p>
            </div>
            <div className="flex gap-2.5">
              <Button size="sm" variant="outline" onClick={() => { fetchApplications(); fetchAnalytics(); }}>
                Active Sync
              </Button>
            </div>
          </div>

          <StaggerContainer>
            {/* System aggregate counts */}
            <StaggerItem className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-850">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block select-none">
                  Pending Submissions
                </span>
                <p className="text-2xl font-black text-indigo-700 dark:text-[#ffc107] font-mono mt-0.5">
                  {analytics?.pendingCount ?? applications.filter(a => ["Submitted", "Under Review", "Processing"].includes(a.status)).length}
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-850">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block select-none">
                  Fully Resolved Files
                </span>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                  {analytics?.approvedCount ?? applications.filter(a => ["Approved", "Rejected"].includes(a.status)).length}
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-850">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block select-none">
                  DB State Checked
                </span>
                <p className="text-sm font-extrabold text-[#2e7d32] mt-1 uppercase flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                  {analytics?.systemStatus?.databaseState ?? "HEALTHY"}
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-850">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block select-none">
                  Redis Engine Keys
                </span>
                <p className="text-sm font-extrabold text-[#2962ff] mt-1 uppercase truncate font-mono">
                  {analytics?.systemStatus?.redisState?.totalHits ?? 810} HITS ({analytics?.systemStatus?.redisState?.hitRatio ?? "94.2%"})
                </p>
              </div>
            </StaggerItem>

            {/* Central Admin view split */}
            <StaggerItem className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
              {/* Left col: list of applications pending administrative shift */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-gray-200 uppercase tracking-widest block">
                  Incoming Applications Registry
                </h3>

                {applicationsLoading ? (
                  <div className="p-12 text-center text-sm text-gray-400 border border-slate-100 rounded-xl animate-pulse">
                    Querying Government Repositories...
                  </div>
                ) : applications.length === 0 ? (
                  <div className="p-10 text-center text-xs text-gray-400 border border-slate-200 bg-white dark:bg-slate-950 rounded-2xl">
                    No citizen files logged in the registry logs currently.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[9px] font-bold font-mono bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                              {app.id}
                            </span>
                            <span className="text-[10px] text-gray-400 font-semibold uppercase">
                              Citizen: {app.citizenName}
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-blue-900 dark:text-[#2962ff]">
                            {app.serviceName}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-semibold leading-relaxed">
                            Form Subject: {app.formData.subject || "Not Specified"}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1 font-semibold">
                            Auditing Remark: {app.remarks}
                          </p>
                        </div>

                        <div className="flex items-center gap-3.5 shrink-0 select-none">
                          <Badge status={app.status} />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActionClick(app)}
                          >
                            Audit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right column: Audit traces feed */}
              <div className="flex flex-col gap-5 text-left">
                <h3 className="text-sm font-black text-slate-900 dark:text-gray-200 uppercase tracking-widest block">
                  Log Audit Trace Trail
                </h3>

                <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-3xl p-5 flex flex-col gap-4 shadow-2xs max-h-[500px] overflow-y-auto">
                  {analytics?.auditLogs && analytics.auditLogs.length > 0 ? (
                    analytics.auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="text-left py-2 border-b border-gray-50 dark:border-slate-900/40 last:border-b-0"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] bg-[#ffc107]/10 text-amber-700 dark:text-amber-500 font-black px-1.5 py-0.2 rounded-xs font-mono select-none">
                            {log.id}
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-700 dark:text-slate-300 mt-1 leading-snug truncate">
                          Task: {log.action}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate uppercase">
                          User: {log.userEmail} ({log.ipAddress})
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-xs text-gray-400 py-6">
                      System activity feed trace offline. Wait on active syncs.
                    </div>
                  )}
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

        </div>
      </div>

      {/* OFFICER DISPASS CHANGE DIALOG */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`Security Audit Audit: ${selectedApp?.id}`}
      >
        <form onSubmit={handleStatusCommit} className="flex flex-col gap-4 text-left">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-gray-200 dark:border-slate-850 rounded-xl">
            <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-widest">
              Citizen File Details
            </span>
            <p className="text-xs font-black text-blue-900 dark:text-[#ffc107] mt-1">
              Applicant: {selectedApp?.citizenName}
            </p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-300 mt-0.5">
              Service: {selectedApp?.serviceName}
            </p>
          </div>

          <div className="text-left">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Filing status Decision
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {["Under Review", "Processing", "Approved", "Rejected"].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setDecision(opt as any)}
                  className={`
                    p-2.5 rounded-xl text-xs font-extrabold transition-all outline-none text-center cursor-pointer select-none
                    ${decision === opt
                      ? "bg-blue-900 text-white dark:bg-[#ffc107] dark:text-slate-950 font-black shadow-xs"
                      : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="text-left">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Officer Auditing Comments / Remarks (Required)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Record biometric audit logs, passport printing lists, or ACRA details..."
              rows={3}
              className="block w-full rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/20 focus:outline-none transition py-2.5 px-3.5"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsActionModalOpen(false)}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="secondary"
              isLoading={updating}
              className="bg-[#ffc107] hover:bg-amber-400 font-bold"
            >
              Commit Decision Pipeline
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}
