import { create } from "zustand";
import { User, Service, Application, Notification } from "../types";

// ==========================================
// API HELPER INTERACTION
// ==========================================
const getHeaders = () => {
  const token = localStorage.getItem("gov_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ==========================================
// STORE SPECIFICATION
// ==========================================

interface AppState {
  // Auth state
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;

  // Catalog state
  services: Service[];
  servicesLoading: boolean;
  servicesSource: "db" | "redis" | null;
  servicesError: string | null;

  // Applications state
  applications: Application[];
  applicationsLoading: boolean;
  applicationsError: string | null;

  // Notification lists
  notifications: Notification[];
  notificationsUnreadCount: number;

  // System Theme
  isDarkMode: boolean;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (payload: { name: string; email: string; pass: string; nric?: string; phone?: string; address?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  
  // Service Catalog Actions
  fetchServices: () => Promise<void>;
  
  // Applications Actions
  fetchApplications: () => Promise<void>;
  submitApplication: (serviceId: string, formData: Record<string, any>, documents?: any[]) => Promise<any>;
  updateApplicationStatus: (appId: string, status: string, remarks: string) => Promise<boolean>;

  // Notification actions
  fetchNotifications: () => Promise<void>;
  markNotificationsAsRead: (ids?: string[]) => Promise<void>;

  // Theme Toggler
  toggleTheme: () => void;
}

export const useCitizenStore = create<AppState>((set, get) => ({
  token: localStorage.getItem("gov_token"),
  user: null,
  isAuthenticated: false,
  isAuthenticating: false,
  authError: null,

  services: [],
  servicesLoading: false,
  servicesSource: null,
  servicesError: null,

  applications: [],
  applicationsLoading: false,
  applicationsError: null,

  notifications: [],
  notificationsUnreadCount: 0,
  isDarkMode: localStorage.getItem("gov_theme") === "dark",

  initialize: async () => {
    const { token } = get();
    // Setup Theme class lists on HTML element
    const html = document.documentElement;
    if (get().isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    if (!token) return;

    try {
      // Decode user state from token profile
      const rawUser = atob(token);
      const userObj = JSON.parse(rawUser);

      // Verify profile against backend and fetch details
      const resp = await fetch("/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.status === 401) {
        // Expired signature
        get().logout();
        return;
      }

      // If valid, build simulated backend user state or set simple profile
      // Let's create current standard profile state
      const userResponse = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.ok) {
        // We set active status
        const isCitizen = userObj.email.startsWith("citizen") || userObj.role === "Citizen";
        const loggedUser: User = {
          id: userObj.id || (isCitizen ? "usr-citizen" : "usr-admin"),
          email: userObj.email,
          name: isCitizen ? "Jonathan Tan" : "Administrator (GovTech)",
          role: userObj.role || (isCitizen ? "Citizen" : "Admin"),
          phone: isCitizen ? "+65 9123 4567" : "+65 6888 8888",
          nric: isCitizen ? "S9584732A" : "S8049382F",
          address: isCitizen 
            ? "Block 124 Ang Mo Kio Ave 3, #12-302, Singapore 560124" 
            : "GovTech Hive, 10 Pasir Panjang Rd, Singapore 117438",
          avatarUrl: isCitizen 
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop" 
            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120&auto=format&fit=crop",
          createdAt: new Date().toISOString(),
        };

        set({
          user: loggedUser,
          isAuthenticated: true,
        });

        // Initialize active downloads
        get().fetchServices();
        get().fetchApplications();
        get().fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to restore GovSession", err);
      get().logout();
    }
  },

  login: async (email, password) => {
    set({ isAuthenticating: true, authError: null });
    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Login credentials unauthorized");
      }

      localStorage.setItem("gov_token", data.token);
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isAuthenticating: false,
      });

      // Fetch operational data
      get().fetchServices();
      get().fetchApplications();
      get().fetchNotifications();
      return true;
    } catch (err: any) {
      set({ authError: err.message, isAuthenticating: false });
      return false;
    }
  },

  register: async (payload) => {
    set({ isAuthenticating: true, authError: null });
    try {
      const resp = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email,
          password: payload.pass,
          name: payload.name,
          phone: payload.phone,
          nric: payload.nric,
          address: payload.address,
        }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Failed registration criteria.");
      }

      localStorage.setItem("gov_token", data.token);
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isAuthenticating: false,
      });

      get().fetchServices();
      get().fetchApplications();
      get().fetchNotifications();
      return true;
    } catch (err: any) {
      set({ authError: err.message, isAuthenticating: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("gov_token");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      applications: [],
      notifications: [],
    });
  },

  updateProfile: async (updates) => {
    const { user, token } = get();
    if (!user || !token) return false;

    try {
      const resp = await fetch("/api/auth/profile", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });

      if (!resp.ok) {
        return false;
      }

      const data = await resp.json();
      set({ user: data.user });
      return true;
    } catch (err) {
      console.error("Profile update failed:", err);
      return false;
    }
  },

  fetchServices: async () => {
    set({ servicesLoading: true, servicesError: null });
    try {
      const resp = await fetch("/api/services");
      const data = await resp.json();
      
      if (resp.ok) {
        set({ 
          services: data.services, 
          servicesSource: data.source,
          servicesLoading: false 
        });
      } else {
        throw new Error(data.error || "Failure loading catalog");
      }
    } catch (err: any) {
      set({ servicesError: err.message, servicesLoading: false });
    }
  },

  fetchApplications: async () => {
    set({ applicationsLoading: true, applicationsError: null });
    try {
      const resp = await fetch("/api/applications", {
        headers: getHeaders(),
      });
      const data = await resp.json();

      if (resp.ok) {
        set({ applications: data.applications, applicationsLoading: false });
      } else {
        throw new Error(data.error || "Failure retrieving apps records");
      }
    } catch (err: any) {
      set({ applicationsError: err.message, applicationsLoading: false });
    }
  },

  submitApplication: async (serviceId, formData, documents = []) => {
    try {
      const resp = await fetch("/api/applications", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ serviceId, formData, documents }),
      });
      const data = await resp.json();

      if (resp.ok) {
        // Append or refresh lists
        await get().fetchApplications();
        await get().fetchNotifications();
        return { success: true, application: data.application };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  updateApplicationStatus: async (appId, status, remarks) => {
    try {
      const resp = await fetch(`/api/admin/applications/${appId}/status`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ status, remarks }),
      });

      if (resp.ok) {
        await get().fetchApplications();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  fetchNotifications: async () => {
    try {
      const resp = await fetch("/api/notifications", {
        headers: getHeaders(),
      });
      const data = await resp.json();

      if (resp.ok) {
        const unread = data.notifications.filter((n: Notification) => !n.read).length;
        set({ 
          notifications: data.notifications, 
          notificationsUnreadCount: unread 
        });
      }
    } catch (err) {
      console.error(err);
    }
  },

  markNotificationsAsRead: async (ids) => {
    try {
      const resp = await fetch("/api/notifications/read", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ ids }),
      });

      if (resp.ok) {
        await get().fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  },

  toggleTheme: () => {
    const isDark = !get().isDarkMode;
    localStorage.setItem("gov_theme", isDark ? "dark" : "light");
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    set({ isDarkMode: isDark });
  },
}));
