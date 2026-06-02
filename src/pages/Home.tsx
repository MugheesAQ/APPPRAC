import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCitizenStore } from "../store/citizenStore";
import { 
  Shield, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Search, 
  ArrowRight,
  BookmarkCheck,
  Building,
  Activity,
  UserCheck
} from "lucide-react";
import { PageTransition, StaggerContainer, StaggerItem } from "../components/animations/PageTransition";
import { Button } from "../components/ui/Button";

// Simulated animated counter component for beautiful entrance statistics
const AnimatedCounter: React.FC<{ target: number; suffix?: string; label: string }> = ({ 
  target, 
  suffix = "", 
  label 
}) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const totalDuration = 1200; // ms
    const incrementTime = Math.max(Math.floor(totalDuration / end), 12);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 40); // larger jumps
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="p-5 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-2xs text-left">
      <h3 className="text-3xl font-extrabold tracking-tight text-blue-900 dark:text-blue-400 font-mono">
        {count.toLocaleString()}{suffix}
      </h3>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { services, fetchServices, isAuthenticated } = useCitizenStore();
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredServices = React.useMemo(() => {
    return services
      .filter((s) => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 3); // show top 3 featured
  }, [services, searchQuery]);

  return (
    <PageTransition>
      {/* Dynamic News Ticker */}
      <div className="bg-amber-500/10 dark:bg-[#ffc107]/10 border-b border-amber-500/20 py-2.5 px-6 lg:px-8 text-xs font-bold text-amber-900 dark:text-[#ffc107] text-left flex items-center gap-2 overflow-hidden select-none">
        <span className="flex items-center gap-1 shrink-0 bg-[#ffc107] text-slate-950 px-2 py-0.5 rounded-sm uppercase tracking-wider text-[9px] font-extrabold font-mono">
          System Alert
        </span>
        <div className="animate-marquee whitespace-nowrap">
          MOH urges users to complete Digital Health Identity registration (MOH-505) by June 30 for continuous subsidies.
        </div>
      </div>

      <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col gap-12">
          {/* Header Hero Branding Layout */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-8 lg:p-14 text-left shadow-xl border border-white/5">
            {/* Subtle background graphics */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-800/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-2xl relative z-10 flex flex-col gap-5">
              <span className="inline-flex items-center gap-1 text-[#ffc107] font-extrabold tracking-widest text-xs uppercase bg-[#ffc107]/10 px-3 py-1.5 rounded-full select-none">
                <Sparkles className="w-3.5 h-3.5" />
                NextGen Citizen Portal v4.2
              </span>
              <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Secure, Automated, <br />
                <span className="text-[#ffc107]">One-Stop Public Services</span>
              </h2>
              <p className="text-sm lg:text-base text-blue-200 leading-relaxed font-medium">
                Access official national government registries. Instantly coordinate business incorporations, update civil identity, track biometric renewal pipelines, and submit documents with security validation.
              </p>

              {/* Instant Search Bar */}
              <div className="mt-4 max-w-lg relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Query service ID or department (e.g., ICA-101, ACRA)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-gray-900 text-sm font-medium pl-11 pr-4 py-3.5 rounded-xl border-none focus:ring-4 focus:ring-[#ffc107]/40 outline-none shadow-lg transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-2">
                {isAuthenticated ? (
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/services")}
                    className="flex items-center gap-1.5 shadow-lg"
                  >
                    <span>Browse Service catalog</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/login")}
                      className="flex items-center gap-1.5"
                    >
                      <span>Sign In with Singpass</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </Button>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-gray-200 bg-white/10 hover:bg-white/15 rounded-xl transition uppercase select-none"
                    >
                      Enroll Citizen Profile
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Entrance statistics counters */}
          <StaggerContainer>
            <StaggerItem className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <AnimatedCounter target={827409} suffix="+" label="Registered Citizens" />
              <AnimatedCounter target={98.4} suffix="%" label="Digital Compliance Ratio" />
              <AnimatedCounter target={2.3} suffix=" Days" label="Average Passport Issuance" />
              <AnimatedCounter target={94.2} suffix="%" label="Redis Cache hit percentage" />
            </StaggerItem>
          </StaggerContainer>

          {/* Featured services overview and details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left mt-2">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-gray-100 flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-blue-900 dark:text-amber-500" />
                Featured Civic Catalog
              </h3>
              
              <div className="flex flex-col gap-4">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => navigate("/services")}
                    className="group bg-white dark:bg-slate-950 p-5 rounded-2xl border border-gray-100 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] bg-blue-900/10 text-blue-900 dark:bg-[#ffc107]/10 dark:text-[#ffc107] font-extrabold px-2 py-0.5 rounded-sm tracking-wider font-mono">
                          {srv.code}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {srv.department}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-900 dark:group-hover:text-amber-500 transition">
                        {srv.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1 max-w-xl">
                        {srv.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Est: {srv.estimatedDays} Days
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        Fee: {srv.fee === 0 ? "FREE" : `$${srv.fee}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-2">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <span>Explore full 27 Department Services Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Side column for trust assurances */}
            <div className="flex flex-col gap-5">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-gray-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-900 dark:text-amber-500" />
                Gateway Assurances
              </h3>

              <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-2xl p-5 flex flex-col gap-5 shadow-2xs">
                <div className="flex items-start gap-4 text-left">
                  <div className="p-2.5 bg-blue-900/10 dark:bg-blue-950 text-blue-900 dark:text-blue-400 rounded-xl">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                      National Security Hardened
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Integrated directly with the Smart National database containing dual TLS/AES constraints and biometric verification check points.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                  <div className="p-2.5 bg-[#ffc107]/15 text-amber-900 dark:text-amber-400 rounded-xl">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                      Redis Compliance caching
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      High performance caching mechanisms. Common catalogue requests are fetched in under 4ms from simulated central in-memory stores.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 rounded-xl">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                      Singpass Compatible
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Instantly recognize, fetch and cache user identities from compliant profiles. Logged as official activity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
