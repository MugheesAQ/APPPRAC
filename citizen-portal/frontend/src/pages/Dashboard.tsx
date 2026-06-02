import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCitizenStore } from "../store/citizenStore";
import { 
  FolderSync, 
  HelpCircle, 
  Activity, 
  ChevronRight,
  Sparkles,
  Inbox,
  AlertCircle
} from "lucide-react";
import { PageTransition, StaggerContainer, StaggerItem } from "../components/animations/PageTransition";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    user, 
    applications, 
    applicationsLoading, 
    fetchApplications, 
    notificationsUnreadCount 
  } = useCitizenStore();

  const [cacheSource, setCacheSource] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Intercept standard applications fetch headers to display cache hit
    const fetchWithHeaderCheck = async () => {
      const token = localStorage.getItem("gov_token");
      try {
        const resp = await fetch("/api/applications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sourceHeader = resp.headers.get("X-Cache-Source") || "Express Direct Server Connection";
        setCacheSource(sourceHeader);
      } catch (e) {
        // Fallback
      }
    };
    
    fetchApplications();
    fetchWithHeaderCheck();
  }, [fetchApplications]);

  // Aggregate application count
  const stats = React.useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => ["Submitted", "Under Review", "Processing"].includes(a.status)).length;
    const resolved = applications.filter(a => ["Approved", "Rejected"].includes(a.status)).length;
    return { total, pending, resolved };
  }, [applications]);

  return (
    <PageTransition>
      <div className="flex-1 w-full bg-[#f5f5f5] text-[#212121] text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col gap-8">
          
          {/* Welcome User and Timing Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#1a237e] text-white rounded-xl shadow-sm border border-white/10 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <span className="text-[10px] bg-[#ffc107] text-[#1a237e] px-2.5 py-1 font-bold uppercase rounded tracking-wider select-none">
                {user?.role === "Admin" ? "OFFICER ASSIGNED" : "VERIFIED ID ACCESS"}
              </span>
              <h2 className="text-2xl font-bold mt-2 flex items-center gap-2">
                Welcome back, {user?.name || "Citizen"}
              </h2>
              <p className="text-sm text-white/70 mt-1">
                National Portal Gateway synced. NRIC Card linked under {user?.nric || "N/A"}.
              </p>
            </div>
            
            <div className="bg-white/10 p-4 border border-white/5 rounded-lg shrink-0 text-left min-w-[200px] transition relative z-10">
              <span className="text-xs text-white/70 uppercase tracking-wider block">
                Source System Sync
              </span>
              <p className="text-sm font-bold text-[#ffc107] mt-1 font-mono uppercase tracking-wide truncate">
                {cacheSource ? cacheSource : "Redis Syncing..."}
              </p>
              <span className="text-[10px] text-white/50 flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                Uptime checked: June 2026
              </span>
            </div>
          </div>

          <StaggerContainer>
            {/* Quick dashboard stats cards row */}
            <StaggerItem className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card hoverEffect={false} className="border border-gray-200 p-5 flex justify-between items-start bg-white rounded-xl shadow-sm">
                <div>
                  <h4 className="text-sm text-gray-500 font-medium">
                    In Process Records
                  </h4>
                  <p className="text-3xl font-bold text-[#212121] mt-2">
                    {stats.pending}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 text-[#2962ff] rounded-lg">
                  <FolderSync className="w-5 h-5" />
                </div>
              </Card>

              <Card hoverEffect={false} className="border border-gray-200 p-5 flex justify-between items-start bg-white rounded-xl shadow-sm">
                <div>
                  <h4 className="text-sm text-gray-500 font-medium">
                    Completed Files
                  </h4>
                  <p className="text-3xl font-bold text-[#212121] mt-2">
                    {stats.resolved}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 text-[#2e7d32] rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
              </Card>

              <Card hoverEffect={false} className="border border-gray-200 p-5 flex justify-between items-start bg-white rounded-xl shadow-sm">
                <div>
                  <h4 className="text-sm text-gray-500 font-medium">
                    Unread Messages
                  </h4>
                  <p className="text-3xl font-bold text-[#212121] mt-2">
                    {notificationsUnreadCount}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 text-[#ed6c02] rounded-lg">
                  <Inbox className="w-5 h-5" />
                </div>
              </Card>
            </StaggerItem>

            {/* Main dashboard core elements */}
            <StaggerItem className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-bold text-[#212121]">
                    My Pending Actions & Applications
                  </h3>
                  <Link
                    to="/services"
                    className="text-sm font-medium text-[#2962ff] hover:underline"
                  >
                    Apply for New Service
                  </Link>
                </div>

                {applicationsLoading ? (
                  <div className="p-12 text-center text-sm text-gray-500 bg-white border border-gray-200 rounded-lg animate-pulse">
                    Querying Government Databases...
                  </div>
                ) : applications.length === 0 ? (
                  <div className="bg-white border border-gray-200 p-8 rounded-lg text-center shadow-sm flex flex-col items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                    <div>
                      <h4 className="text-sm font-bold text-[#212121]">
                        No Active Applications Found
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                        You do not have any submitted registrations or requests linked to your profile.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => navigate("/services")}
                      className="mt-4"
                    >
                      Browse Service Catalogue
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => navigate("/track")}
                        className="group bg-white p-4 rounded-lg border border-gray-200 hover:border-[#2962ff] hover:shadow-md transition duration-200 cursor-pointer flex items-center justify-between gap-4"
                      >
                        <div className="text-left">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded font-mono">
                              {app.id}
                            </span>
                            <span className="text-xs text-gray-500">
                              Submitted: {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-[#212121] group-hover:text-[#2962ff]">
                            {app.serviceName}
                          </h4>
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                            Remarks: {app.remarks}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 select-none">
                          <Badge status={app.status} />
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#2962ff] transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Quick-links and FAQs info */}
              <div className="flex flex-col gap-5 text-left">
                <h3 className="text-lg font-bold text-[#212121] border-b border-gray-200 pb-2">
                  National Assistance Faqs
                </h3>

                <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-6 shadow-sm">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-[#212121] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#2962ff] shrink-0" />
                      What is the average renewal wait?
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">
                      Registrations process in typically 2 business days. Printed physical documents will be delivered in 3 to 5 work days.
                    </p>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="text-left">
                    <h4 className="text-sm font-bold text-[#212121] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#2962ff] shrink-0" />
                      Are document loads secure?
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">
                      Yes. All attachments are securely encrypted, scanned for integrity, and stored safely in our regional datacenters.
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

        </div>
      </div>
    </PageTransition>
  );
}
