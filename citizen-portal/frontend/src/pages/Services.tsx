import * as React from "react";
import { useCitizenStore } from "../store/citizenStore";
import { Service } from "../types";
import { 
  Search, 
  MapPin, 
  Layers, 
  Info, 
  FileCheck, 
  DollarSign, 
  HelpCircle, 
  UploadCloud, 
  FileText, 
  X,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PageTransition, StaggerContainer, StaggerItem, SkeletonCard } from "../components/animations/PageTransition";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { showToast } from "../components/ui/Toast";

export default function Services() {
  const { services, servicesLoading, servicesSource, fetchServices, submitApplication } = useCitizenStore();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("ALL");

  // Modal State
  const [activeService, setActiveService] = React.useState<Service | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);

  // Form Fields State
  const [subject, setSubject] = React.useState("");
  const [remarks, setRemarks] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Document attachments state
  const [attachedFiles, setAttachedFiles] = React.useState<{ name: string; type: string; url: string }[]>([]);
  const [uploadLoading, setUploadLoading] = React.useState(false);

  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Extract Departments for filtration tabs
  const departments = React.useMemo(() => {
    const list = new Set(services.map((s) => s.department));
    return ["ALL", ...Array.from(list)];
  }, [services]);

  const filteredServices = React.useMemo(() => {
    return services.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDept === "ALL" || s.department === selectedDept;
      return matchSearch && matchDept;
    });
  }, [services, searchQuery, selectedDept]);

  // Handle local File Reading for base64 serialization & simulated Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Uploaded attachments must stay below the standard 5MB criteria.", "error", "File Too Large");
      return;
    }

    const fileType = file.type;
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(fileType)) {
      showToast("Verification reject: Attachment must be either PDF, JPEG, or PNG.", "error", "Unsupported File Format");
      return;
    }

    setUploadLoading(true);
    try {
      // 1. Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        
        // 2. Transmit to backend upload proxy
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
          setAttachedFiles((prev) => [...prev, { name: file.name, type: file.type, url: res.url }]);
          showToast(`Attachment '${file.name}' compiled successfully.`, "success", "Documents Synced");
        } else {
          showToast(res.error || "Attachment error.", "error", "Upload Failed");
        }
        setUploadLoading(false);
      };
    } catch (err) {
      console.error(err);
      showToast("Physical reading constraint on selected file.", "error", "Upload Failed");
      setUploadLoading(false);
    }
  };

  const handleApplyClick = (service: Service) => {
    setActiveService(service);
    // Reset Form Fields
    setSubject("");
    setRemarks("");
    setAttachedFiles([]);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService) return;

    if (!subject.trim()) {
      showToast("Application Subject declaration is required.", "warning", "Incomplete Fields");
      return;
    }

    setIsSubmitting(true);
    const result = await submitApplication(activeService.id, {
      subject: subject.trim(),
      remarks: remarks.trim(),
      contact_phone: localStorage.getItem("gov_phone") || "",
    }, attachedFiles);

    setIsSubmitting(false);

    if (result.success) {
      setIsApplyModalOpen(false);
      showToast(`Your application packet for ${activeService.name} was successfully queued.`, "success", "Application Logged");
    } else {
      showToast(result.error || "Failed submitting application criteria.", "error", "Submission Offline");
    }
  };

  return (
    <PageTransition>
      <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900 text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col gap-6">
          
          {/* Section heading overview */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-150 dark:border-slate-800 pb-5 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-gray-100 uppercase tracking-wider">
                Government Services Directory
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Access and deploy applications regarding civic assistance, corporate licensing, passports, and medical coverage.
              </p>
            </div>

            {/* Micro display specifying Redis cache utility */}
            {servicesSource === "redis" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#ffc107]/15 text-[#ffc107] border border-amber-500/20 shadow-xxs font-mono uppercase">
                <span className="w-1.5 h-1.5 bg-[#ffc107] rounded-full animate-ping"></span>
                Cached Catalogue Response (Under 3ms)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* SEARCH & FILTER AREA */}
            <div className="flex flex-col gap-5 lg:col-span-1">
              {/* Search text field */}
              <div className="relative text-left">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Search keyword
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search srv-code, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 text-xs font-semibold pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-slate-850 outline-none focus:ring-4 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Department categorization menus */}
              <div className="text-left">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                  Select Department node
                </label>
                <div className="flex flex-col gap-1">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`
                        w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 select-none cursor-pointer
                        ${selectedDept === dept 
                          ? "bg-blue-900 text-white dark:bg-[#ffc107] dark:text-slate-950 shadow-xs" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60"}
                      `}
                    >
                      {dept === "ALL" ? "All Departments" : dept}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SERVICES CARDS DIRECTORY VISUALS */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {servicesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="p-16 text-center text-sm font-semibold text-gray-400 bg-white dark:bg-slate-950 rounded-2xl border border-dashed border-gray-200 dark:border-slate-850">
                  No compatible services criteria match your search query.
                </div>
              ) : (
                <StaggerContainer>
                  <StaggerItem className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredServices.map((srv) => (
                      <Card
                        key={srv.id}
                        hoverEffect={true}
                        className="flex flex-col justify-between hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition"
                      >
                        <div>
                          {/* Card Category Info Tag */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-[10px] bg-blue-900/10 text-blue-900 dark:bg-[#ffc107]/10 dark:text-[#ffc107] font-extrabold px-2 py-0.5 rounded-sm tracking-wider font-mono">
                              {srv.code}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate max-w-[150px]">
                              {srv.department}
                            </span>
                          </div>

                          <h3 className="text-sm font-extrabold text-[#1a237e] dark:text-[#2962ff] leading-snug">
                            {srv.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 mt-2 leading-relaxed font-medium">
                            {srv.description}
                          </p>

                          {/* Extra requirements check boxes on Expand click simulation */}
                          <div className="mt-4 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-gray-150 dark:border-slate-850">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 select-none">
                              Filing requirements
                            </span>
                            <ul className="space-y-1">
                              {srv.requirements.map((req, rid) => (
                                <li key={rid} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5 font-semibold">
                                  <span className="text-emerald-500 font-extrabold shrink-0">✓</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Card bottom price and triggers */}
                        <div className="mt-5 pt-3.5 border-t border-gray-100 dark:border-slate-850/60 flex items-center justify-between">
                          <div className="text-left">
                            <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-widest leading-none">
                              Registration fee
                            </span>
                            <span className="text-sm font-black text-gray-800 dark:text-gray-200 font-mono">
                              {srv.fee === 0 ? "FREE" : `$${srv.fee}`}
                            </span>
                          </div>
                          
                          <Button
                            variant="secondary"
                            onClick={() => handleApplyClick(srv)}
                            size="sm"
                            className="bg-[#ffc107] hover:bg-amber-400 hover:shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            <span>Apply Now</span>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </StaggerItem>
                </StaggerContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED APPLY FORM MODAL */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Citizen Application: ${activeService?.name}`}
      >
        <form onSubmit={handleSubmitApplication} className="flex flex-col gap-4">
          <div className="bg-blue-50/20 dark:bg-indigo-950/20 p-4 rounded-xl border border-gray-150 dark:border-slate-850">
            <h4 className="text-xs font-extrabold text-blue-900 dark:text-blue-400 uppercase tracking-wider mb-1">
              Filing Constraints for {activeService?.code}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Please verify you have readied the requirements: <strong>{activeService?.requirements.slice(0, 2).join(", ")}</strong>. Average turnaround schedule holds about {activeService?.estimatedDays} working days.
            </p>
          </div>

          <Input
            label="Application Subject / Reference"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Passport Renewal Request for Jamila Bibi"
            required
          />

          <div className="text-left">
            <label className="block text-xs font-bold tracking-wide text-blue-900/90 dark:text-gray-300 mb-1.5 uppercase">
              Applicant Supporting Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Provide any additional comments, declarations, or NRIC checks requested..."
              rows={3}
              className="block w-full rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/20 focus:outline-none transition py-2.5 px-3.5"
            />
          </div>

          {/* DRAG-PICK Uploader Block */}
          <div className="text-left">
            <label className="block text-xs font-bold tracking-wide text-blue-900/90 dark:text-gray-300 mb-2 uppercase select-none">
              Upload Supporting Documents (PDF/JPG, Max 5MB)
            </label>
            
            <div className="relative border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:border-slate-300 transition text-center cursor-pointer">
              <input
                type="file"
                accept=".pdf,.jpeg,.jpg,.png"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploadLoading}
              />
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {uploadLoading ? "Uploading Attachment..." : "Drag and drop or click to upload supporting proof"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                Accepted types: Biosecure PDF, JPEG, PNG
              </p>
            </div>

            {/* Attached documents preview list */}
            {attachedFiles.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-2">
                {attachedFiles.map((file, fidx) => (
                  <div
                    key={fidx}
                    className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200"
                  >
                    <FileText className="w-4 h-4 text-blue-900 shrink-0" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== fidx))}
                      className="text-rose-500 hover:text-rose-700 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3.5 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsApplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              isLoading={isSubmitting}
              className="bg-[#ffc107] hover:bg-amber-400"
            >
              Verify & Launch Application
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}
