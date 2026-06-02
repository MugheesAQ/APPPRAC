import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCitizenStore } from "../store/citizenStore";
import { ShieldAlert, KeyRound, Eye, EyeOff, Sparkles } from "lucide-react";
import { PageTransition } from "../components/animations/PageTransition";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { showToast } from "../components/ui/Toast";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticating, authError, isAuthenticated } = useCitizenStore();

  const [email, setEmail] = React.useState("citizen@gov.sg");
  const [password, setPassword] = React.useState("citizen123");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showPass, setShowPass] = React.useState(false);

  // Auto route if already verified
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!email) {
      tempErrors.email = "National portal registration email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please specify a valid electronic address format.";
    }

    if (!password) {
      tempErrors.password = "Authentication password is required.";
    } else if (password.length < 6) {
      tempErrors.password = "Your gateway key must count to at least 6 characters.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await login(email, password);
    if (success) {
      showToast("Access granted. Digital session initialized successfully.", "success", "Welcome Citizen");
      navigate("/");
    } else {
      showToast("Verification failed. Please check credentials or seek assistance.", "error", "Credentials Rejected");
    }
  };

  const fillQuickAcc = (role: "Citizen" | "Admin") => {
    if (role === "Citizen") {
      setEmail("citizen@gov.sg");
      setPassword("citizen123");
    } else {
      setEmail("admin@gov.sg");
      setPassword("admin123");
    }
    showToast(`Infilled mock account for role '${role}'`, "info", "Singpass Auto-Fill");
  };

  return (
    <PageTransition>
      <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-6 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-3xl shadow-2xl overflow-hidden text-left flex flex-col">
          {/* Header Brand Stripe */}
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 p-6 text-white pb-8">
            <span className="inline-flex items-center gap-1 bg-[#ffc107]/20 text-[#ffc107] font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 select-none">
              <Sparkles className="w-3 h-3" />
              Secure Authentication Gateway
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">
              Sign In to GovPortal
            </h2>
            <p className="text-xs text-blue-200 mt-1.5 font-medium leading-relaxed">
              Login securely using Singpass credentials. Protect your civic records under the central data protection act.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            {authError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl p-4 flex gap-3 text-xs leading-relaxed font-semibold">
                <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <Input
              label="Citizen Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={errors.email}
              placeholder="e.g., citizen@gov.sg"
            />

            <div className="relative">
              <Input
                label="Identity Password Key"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                error={errors.password}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                icon={<KeyRound className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-[39px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isAuthenticating}
              className="mt-2 text-sm uppercase py-3 font-bold block w-full"
            >
              Sign In securely
            </Button>

            {/* Quick Demo Assist Block */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 border border-gray-150 dark:border-slate-850 rounded-2xl flex flex-col gap-2.5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">
                Developer Simulation Controls
              </p>
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => fillQuickAcc("Citizen")}
                  className="bg-white dark:bg-slate-950 hover:bg-slate-100 border border-gray-200 dark:border-slate-8 w-full block py-2 rounded-xl text-xs font-bold text-blue-900 dark:text-blue-400 cursor-pointer"
                >
                  Fill Mock Citizen
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickAcc("Admin")}
                  className="bg-white dark:bg-slate-950 hover:bg-slate-100 border border-gray-200 dark:border-slate-8 w-full block py-2 rounded-xl text-xs font-bold text-amber-600 cursor-pointer"
                >
                  Fill Mock Officer
                </button>
              </div>
            </div>

            <div className="text-center mt-2 flex justify-between text-xs font-semibold text-gray-500">
              <Link to="/register" className="hover:text-blue-900 dark:hover:text-[#ffc107]">
                Don&apos;t have a profile? Register here
              </Link>
              <span className="hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
