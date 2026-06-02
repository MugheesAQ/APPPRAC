import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCitizenStore } from "../../store/citizenStore";
import { 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  Shield, 
  FolderLock, 
  Menu,
  ChevronDown
} from "lucide-react";

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    logout, 
    isDarkMode, 
    toggleTheme, 
    notifications, 
    notificationsUnreadCount,
    markNotificationsAsRead 
  } = useCitizenStore();

  const [notifOpen, setNotifOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const notifRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  // Close menus on click-outside
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleMarkAllRead = () => {
    markNotificationsAsRead();
    setNotifOpen(false);
  };

  return (
    <header className="shrink-0 h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40 text-[#212121]">
        {/* Left branding layout */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={onMobileMenuToggle}
              className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 group">
            {/* National Crest Simulation Badge */}
            <div className="w-8 h-8 rounded-lg bg-[#ffc107] flex items-center justify-center font-bold text-[#1a237e] text-sm shadow-inner group-hover:scale-105 transition">
              G
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold tracking-tight text-[#212121]">
                CitizenPortal
              </h1>
            </div>
          </Link>
        </div>

        {/* Right utility elements */}
        <div className="flex items-center gap-4">
          {/* Theme Shift */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-300 hover:text-[#ffc107] hover:bg-white/5 transition-all cursor-pointer"
            title="Toggle Accessibility Contrast Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notification Inbox Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-gray-600 relative cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {notificationsUnreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-[#d32f2f] border-2 border-white rounded-full"></span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 rounded-xl bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 shadow-2xl overflow-hidden text-gray-800 dark:text-gray-100 z-50">
                    <div className="bg-slate-50 dark:bg-slate-900 border-b border-gray-150 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase dark:text-gray-300">
                        Government Alerts
                      </span>
                      {notificationsUnreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] font-semibold text-blue-800 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-gray-400">
                          No pending messages or critical actions list.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3.5 transition text-left text-xs ${notif.read ? "opacity-75" : "bg-blue-50/20 dark:bg-indigo-950/20 font-medium"}`}
                          >
                            <div className="flex justify-between items-start mb-0.5">
                              <span className="font-bold text-gray-800 dark:text-slate-200">
                                {notif.title}
                              </span>
                              <span className="text-[9px] text-gray-400">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-10 w-[1px] bg-gray-200 mx-2"></div>
              {/* USER SECTOR & SINGPASS BADGE DISPLAY */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-all font-medium"
                >
                  <img
                    src={user?.avatarUrl || "https://api.dicebear.com/7.x/initials/svg?seed=JT"}
                    alt="Citizen Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="hidden md:block text-left text-sm text-[#212121]">
                    {user?.name}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 shadow-2xl overflow-hidden text-gray-800 dark:text-gray-100 z-50">
                    {/* ID Header card info */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-gray-150 dark:border-slate-800 text-left">
                      <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1 text-left text-xs">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300 transition"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span>My Identity Profile</span>
                      </Link>

                      {user?.role === "Admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300 transition"
                        >
                          <Shield className="w-4 h-4 text-[#ffc107]" />
                          <span className="font-semibold text-indigo-700 dark:text-indigo-400">Officer Dashboard</span>
                        </Link>
                      )}

                      <hr className="border-gray-100 dark:border-slate-800/80 my-1" />

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                          navigate("/login");
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of Gateway</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-[#ffc107] hover:bg-amber-400 transition"
            >
              Sign In
            </Link>
          )}
        </div>
    </header>
  );
};
