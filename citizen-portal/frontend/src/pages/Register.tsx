import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCitizenStore } from "../store/citizenStore";
import { ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { PageTransition } from "../components/animations/PageTransition";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { showToast } from "../components/ui/Toast";

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticating, authError, isAuthenticated } = useCitizenStore();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [nric, setNric] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const temp: Record<string, string> = {};
    if (!name.trim()) temp.name = "Full Legal Name is required for registration.";
    if (!email.trim()) {
      temp.email = "Citizen contact email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      temp.email = "Please enter a valid electronic email formatting.";
    }

    if (!password) {
      temp.password = "A secret credential password is required.";
    } else if (password.length < 6) {
      temp.password = "Security password must reach at least 6 characters.";
    }

    if (nric && !/^[STFGM]\d{7}[A-Z]$/i.test(nric.trim())) {
      temp.nric = "NRIC format: Starting S/T, followed by 7 digits and ending with a letter.";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await register({
      name,
      email,
      pass: password,
      nric,
      phone,
      address,
    });

    if (success) {
      showToast("Citizen file safely logged. Welcome to the portal central registry.", "success", "Enrollment Complete");
      navigate("/");
    } else {
      showToast("Access log error. Email already configured on current system databases.", "error", "Registration Rejected");
    }
  };

  return (
    <PageTransition>
      <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-6 py-12">
        <div className="w-full max-w-lg bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-3xl shadow-2xl overflow-hidden text-left">
          {/* Layout Header Stripe */}
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 p-6 text-white pb-7">
            <span className="inline-flex items-center gap-1 bg-[#ffc107]/20 text-[#ffc107] font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 select-none">
              <Sparkles className="w-3 h-3" />
              National Enrollment Node
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">
              Create Citizen Profile
            </h2>
            <p className="text-xs text-blue-200 mt-1 font-medium leading-relaxed">
              Incorporate identity data to initialize virtual Singpass records or register sub-profiles. Securely linked checking filters active.
            </p>
          </div>

          <form onSubmit={handleRegister} className="p-6 flex flex-col gap-4">
            {authError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl p-4 flex gap-2 text-xs leading-relaxed font-semibold">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: "" }));
                }}
                error={errors.name}
                placeholder="e.g., Jonathan Tan"
              />

              <Input
                label="Electronic Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                error={errors.email}
                placeholder="e.g., jon.tan@gmail.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="National NRIC Number"
                value={nric}
                onChange={(e) => {
                  setNric(e.target.value);
                  setErrors((prev) => ({ ...prev, nric: "" }));
                }}
                error={errors.nric}
                placeholder="e.g., S9584732A"
              />

              <Input
                label="Phone contact link"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., +65 9123 4567"
              />
            </div>

            <Input
              label="Secure Access Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              error={errors.password}
              placeholder="Min 6 characters"
            />

            <Input
              label="Residential Mailing Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Block, Avenue, street-name and #unit-no details"
            />

            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 flex gap-2.5 items-center rounded-xl border border-gray-150 dark:border-slate-850 mt-1">
              <ShieldCheck className="w-5.5 h-5.5 text-blue-900 dark:text-amber-500 shrink-0" />
              <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                By clicking submit, your identity is simulated against central public registries. Secure encryption guarantees anonymity across secondary catalogs.
              </p>
            </div>

            <Button
              type="submit"
              variant="secondary"
              isLoading={isAuthenticating}
              className="mt-2 py-3 font-bold uppercase block w-full shadow-md"
            >
              Link and Launch Profile
            </Button>

            <div className="text-center mt-2 text-xs font-semibold text-gray-500">
              <Link to="/login" className="hover:text-blue-900 dark:hover:text-[#ffc107]">
                Already registered under GovPortal? Log in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
