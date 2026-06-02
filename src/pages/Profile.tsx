import * as React from "react";
import { useCitizenStore } from "../store/citizenStore";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  Upload,
  AlertCircle
} from "lucide-react";
import { PageTransition } from "../components/animations/PageTransition";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { showToast } from "../components/ui/Toast";

export default function Profile() {
  const { user, updateProfile } = useCitizenStore();

  const [name, setName] = React.useState(user?.name || "");
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [address, setAddress] = React.useState(user?.address || "");
  
  const [saving, setSaving] = React.useState(false);
  const [avatarLoading, setAvatarLoading] = React.useState(false);

  // Synchronise state when user completes checkout login
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Legal Name change cannot be blank.", "warning", "Validation Failed");
      return;
    }

    setSaving(true);
    const success = await updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });
    setSaving(false);

    if (success) {
      showToast("Profile records compiled and saved securely.", "success", "Records Saved");
    } else {
      showToast("Session error or offline datastore saving bug.", "error", "Save Failed");
    }
  };

  const handleAvatarPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Profile photo must stay below the standard 2MB limit.", "error", "File Too Large");
      return;
    }

    setAvatarLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        
        const resp = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("gov_token")}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileData: base64Data,
          }),
        });

        const res = await resp.json();
        if (resp.ok) {
          // Commit avatar to profile
          const updatedAvatar = await updateProfile({ avatarUrl: base64Data });
          if (updatedAvatar) {
            showToast("New smart passport avatar uploaded successfully.", "success", "Identity Updated");
          }
        } else {
          showToast(res.error || "Avatar sync failure.", "error", "Process Failed");
        }
        setAvatarLoading(false);
      };
    } catch (err) {
      console.error(err);
      setAvatarLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900 text-left">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 flex flex-col gap-6">

          <div className="border-b border-gray-150 dark:border-slate-800 pb-5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-gray-100 uppercase tracking-wider">
              National ID Profile
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Verify legal registration documents, update Singpass communication anchors, and inspect cryptographic active credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* AVATAR AND LOCK STATUS COL */}
            <div className="flex flex-col gap-4">
              <Card hoverEffect={false} className="bg-white dark:bg-slate-950 p-6 flex flex-col items-center text-center">
                <div className="relative group select-none">
                  <img
                    src={user?.avatarUrl || "https://api.dicebear.com/7.x/initials/svg?seed=JT"}
                    alt="Citizen Profile"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-900/10 dark:ring-[#ffc107]/20"
                  />
                  <label className="absolute bottom-0 right-0 p-1.5 bg-blue-950 hover:bg-indigo-900 text-white dark:bg-slate-800 rounded-full cursor-pointer shadow-md transition shrink-0">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleAvatarPick}
                      className="hidden"
                      disabled={avatarLoading}
                    />
                    <Upload className="w-4 h-4" />
                  </label>
                </div>

                <h3 className="text-md font-bold text-slate-900 dark:text-gray-150 mt-4 leading-none truncate w-full">
                  {user?.name}
                </h3>
                <span className="text-[9px] bg-[#ffc107] text-slate-950 px-2 py-0.5 rounded-xs uppercase font-extrabold mt-1.5 tracking-wider select-none font-mono">
                  {user?.role === "Admin" ? "Senior Officer" : "Singpass User"}
                </span>

                <hr className="w-full border-gray-100 dark:border-slate-850 mt-5 mb-4" />

                <div className="w-full text-left gap-3.5 flex flex-col text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2.5 truncate dark:text-slate-350">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 dark:text-slate-350">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{user?.phone || "No contact line"}</span>
                  </div>
                </div>
              </Card>

              {/* Secure Credentials status banner */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-4 rounded-2xl flex gap-3 text-left">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wide">
                    NRIC: {user?.nric || "N/A"}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-semibold uppercase">
                    SGDN Level-3 Identity Auditor cleared. Linked directly with GovTech hive datastores safely.
                  </p>
                </div>
              </div>
            </div>

            {/* EDITABLE DETAILS PROFILE FORM COL */}
            <div className="md:col-span-2">
              <form onSubmit={handleProfileSave} className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-2xs text-left flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-gray-200 uppercase tracking-widest border-b border-gray-50 dark:border-slate-900/60 pb-3 mb-1">
                  Manage Connection Anchors
                </h3>

                <Input
                  label="Legal Registration Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Legal passport name"
                  required
                />

                <Input
                  label="Mobile Contact phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+65 9123 4567"
                />

                <div className="text-left">
                  <label className="block text-xs font-bold tracking-wide text-blue-900/90 dark:text-gray-300 mb-1.5 uppercase select-none">
                    Residential Mailing Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Provide full Block, Ave, unit numbers..."
                    rows={3}
                    className="block w-full rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/20 focus:outline-[#1a237e] focus:outline-none transition py-2.5 px-3.5"
                  />
                </div>

                <div className="flex justify-end gap-3.5 mt-2 pt-3.5 border-t border-gray-100 dark:border-slate-850/60">
                  <Button
                    type="submit"
                    variant="secondary"
                    isLoading={saving}
                    className="bg-[#ffc107] hover:bg-amber-400 text-slate-950 font-bold"
                  >
                    Confirm & Update Records
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
