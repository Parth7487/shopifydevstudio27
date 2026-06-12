import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Database,
  Cloud,
  Settings as SettingsIcon,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  FolderLock,
  Globe,
  Tag,
  Cpu,
  BarChart,
  Tv,
  Film,
  GripVertical,
  ImagePlus,
  X,
  Loader2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import GoogleDriveSync from "../components/GoogleDriveSync";
import { useProjects } from "../hooks/useProjects";

// ─── Sortable Project Card ───────────────────────────────────────────────────

interface ProjectCardProps {
  project: any;
  onEdit: (p: any) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const SortableProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <motion.div
        className={`bg-black/80 border rounded-xl overflow-hidden shadow-xl flex flex-col justify-between h-full transition-all ${
          isDragging ? "border-beige/40 shadow-beige/10" : "border-white/10"
        }`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 left-3 z-10 p-1.5 bg-black/70 rounded-lg cursor-grab active:cursor-grabbing text-gray-400 hover:text-white hover:bg-black/90 transition-all"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div>
          <div className="relative h-44 bg-gray-900">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <span className="absolute top-3 right-3 px-3 py-1 bg-black/80 text-xs font-semibold text-beige border border-beige/30 rounded-full">
              {project.category}
            </span>
            {project.featured && (
              <span className="absolute top-3 left-10 px-2 py-1 bg-beige/20 text-xs font-semibold text-beige border border-beige/40 rounded-full">
                ★ Featured
              </span>
            )}
          </div>

          <div className="p-5 space-y-2">
            <h4 className="text-base font-bold text-white leading-tight">{project.title}</h4>
            <p className="text-gray-500 text-xs font-medium">{project.brand}</p>
            <p className="text-gray-400 text-xs line-clamp-2">{project.description}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {(project.tags || []).slice(0, 3).map((tag: string, i: number) => (
                <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 border-t border-white/5 flex gap-3 mt-3 pt-3">
          <button
            onClick={() => onEdit(project)}
            className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="px-3 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 rounded-lg text-xs font-medium flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Image Upload Component ───────────────────────────────────────────────────

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (JPG, PNG, WebP, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File too large (max 10MB)");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError("");

    try {
      // Get a signed upload token from our server
      const signRes = await fetch("/api/cloudinary-sign", { method: "POST" });
      if (!signRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, api_key, cloud_name, folder } = await signRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", String(timestamp));
      formData.append("api_key", api_key);
      formData.append("folder", folder);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };

      const uploadPromise = new Promise<{ secure_url: string }>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (err) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error?.message || "Upload failed"));
            } catch (e) {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.onabort = () => reject(new Error("Upload aborted"));
      });

      xhr.send(formData);
      const data = await uploadPromise;

      // Auto-optimize with Cloudinary transformations
      const optimizedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_800/"
      );
      onChange(optimizedUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadToCloudinary(file);
  }, [uploadToCloudinary]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadToCloudinary(file);
  };

  return (
    <div className="space-y-2">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileRef.current?.click()}
        className={`relative w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden ${
          isDraggingOver
            ? "border-beige/80 bg-beige/10"
            : "border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04]"
        }`}
      >
        {/* Preview */}
        {value && !isUploading && (
          <img
            src={value}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}

        <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-beige animate-spin" />
              <span className="text-xs text-gray-400">Uploading: {uploadProgress}%</span>
              <div className="w-32 bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-beige h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
              </div>
            </>
          ) : (
            <>
              <ImagePlus className={`w-8 h-8 ${isDraggingOver ? "text-beige" : "text-gray-500"}`} />
              <div>
                <p className="text-xs font-medium text-gray-300">
                  {value ? "Drop new image or click to replace" : "Drop image here or click to upload"}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">JPG, PNG, WebP · max 10MB</p>
              </div>
            </>
          )}
        </div>

        {/* Clear button */}
        {value && !isUploading && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="absolute top-2 right-2 z-20 w-6 h-6 bg-red-900/80 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {uploadError && (
        <p className="text-red-400 text-xs">{uploadError}</p>
      )}

      {/* Manual URL fallback */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">or paste URL</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://res.cloudinary.com/... or any image URL"
        className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-beige/60 transition-colors"
      />
    </div>
  );
};

// ─── Video Upload Component ───────────────────────────────────────────────────

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const VideoUpload = ({ value, onChange }: VideoUploadProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setUploadError("Please upload a video file (MP4, WebM, MOV, etc.)");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setUploadError("File too large (max 100MB)");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError("");

    try {
      // Get a signed upload token from our server
      const signRes = await fetch("/api/cloudinary-sign", { method: "POST" });
      if (!signRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, api_key, cloud_name, folder } = await signRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", String(timestamp));
      formData.append("api_key", api_key);
      formData.append("folder", folder);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };

      const uploadPromise = new Promise<{ secure_url: string }>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (err) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error?.message || "Upload failed"));
            } catch (e) {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.onabort = () => reject(new Error("Upload aborted"));
      });

      xhr.send(formData);
      const data = await uploadPromise;

      // Auto-optimize video quality/format by injecting f_auto,q_auto
      const optimizedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto/"
      );
      onChange(optimizedUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadToCloudinary(file);
  }, [uploadToCloudinary]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadToCloudinary(file);
  };

  return (
    <div className="space-y-2">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileRef.current?.click()}
        className={`relative w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden ${
          isDraggingOver
            ? "border-beige/80 bg-beige/10"
            : "border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04]"
        }`}
      >
        {/* Preview */}
        {value && !isUploading && (
          <video
            src={value}
            className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
            muted
            playsInline
            loop
            autoPlay
          />
        )}

        <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-beige animate-spin" />
              <span className="text-xs text-gray-400">Uploading: {uploadProgress}%</span>
              <div className="w-32 bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-beige h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
              </div>
            </>
          ) : (
            <>
              <Film className={`w-8 h-8 ${isDraggingOver ? "text-beige" : "text-gray-500"}`} />
              <div>
                <p className="text-xs font-medium text-gray-300">
                  {value ? "Drop new video or click to replace" : "Drop video here or click to upload"}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">MP4, WebM, MOV · max 100MB</p>
              </div>
            </>
          )}
        </div>

        {/* Clear button */}
        {value && !isUploading && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="absolute top-2 right-2 z-20 w-6 h-6 bg-red-900/80 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <input ref={fileRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />

      {uploadError && (
        <p className="text-red-400 text-xs">{uploadError}</p>
      )}

      {/* Manual URL fallback */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">or paste URL</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://res.cloudinary.com/... or any video URL"
        className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-beige/60 transition-colors"
      />
    </div>
  );
};

// ─── Main Admin Component ─────────────────────────────────────────────────────

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "drive" | "database" | "settings">("projects");

  const tabs = [
    { id: "projects", label: "Manage Projects", icon: FolderLock },
    { id: "drive", label: "Google Drive Sync", icon: Cloud },
    { id: "database", label: "Database", icon: Database },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ] as const;

  const [neonConnected, setNeonConnected] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    sessionStorage.getItem("admin_authenticated") === "true"
  );
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { projects: rawProjects, loading: projectsLoading, error: projectsError, refetch } = useProjects();

  // Local ordered list for drag-and-drop
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Sync localProjects when rawProjects changes
  React.useEffect(() => {
    setLocalProjects(rawProjects);
  }, [rawProjects]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localProjects.findIndex((p) => p.id === active.id);
    const newIndex = localProjects.findIndex((p) => p.id === over.id);
    const newOrder = arrayMove(localProjects, oldIndex, newIndex);
    setLocalProjects(newOrder);

    // Save to backend
    setIsSavingOrder(true);
    try {
      await fetch("/api/portfolio-order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder.map((p) => p.id) }),
      });
    } catch (err) {
      console.error("Failed to save order:", err);
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [tagsInput, setTagsInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [conversionMetric, setConversionMetric] = useState("");
  const [loadTimeMetric, setLoadTimeMetric] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [status, setStatus] = useState("published");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const openAddForm = () => {
    setEditingProject(null);
    setTitle(""); setBrand(""); setDescription(""); setImage(""); setVideoUrl("");
    setCategory("Fashion"); setTagsInput(""); setTechInput("");
    setConversionMetric("350%"); setLoadTimeMetric("0.6s");
    setLiveUrl(""); setFeatured(false); setHasVideo(false); setStatus("published");
    setShowForm(true);
  };

  const openEditForm = (project: any) => {
    setEditingProject(project);
    setTitle(project.title || "");
    setBrand(project.brand || "");
    setDescription(project.description || "");
    setImage(project.image || "");
    setVideoUrl(project.videoUrl || "");
    setCategory(project.category || "Fashion");
    setTagsInput((project.tags || []).join(", "));
    setTechInput((project.tech || []).join(", "));
    setConversionMetric(project.metrics?.conversion || "0%");
    setLoadTimeMetric(project.metrics?.loadTime || "0s");
    setLiveUrl(project.liveUrl || "");
    setFeatured(project.featured || false);
    setHasVideo(project.hasVideo || false);
    setStatus(project.status || "published");
    setShowForm(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title, brand, description, image,
      video_url: videoUrl || null,
      category,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      tech: techInput.split(",").map((t) => t.trim()).filter(Boolean),
      metrics: { conversion: conversionMetric, load_time: loadTimeMetric },
      live_url: liveUrl,
      featured,
      has_video: hasVideo,
      status,
    };

    try {
      const url = editingProject ? `/api/portfolio/${editingProject.id}` : "/api/portfolio";
      const method = editingProject ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
      setShowForm(false);
      await refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
      await refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localProjects, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `shopifydevstudio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) { alert("Invalid backup file"); return; }
        if (!confirm(`Import ${parsed.length} projects into database?`)) return;
        setIsSubmitting(true);
        for (const item of parsed) {
          await fetch("/api/portfolio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: item.title, brand: item.brand, description: item.description,
              image: item.image, video_url: item.videoUrl || item.video_url || null,
              category: item.category || "Fashion",
              tags: item.tags || [], tech: item.tech || [],
              metrics: { conversion: item.metrics?.conversion || "0%", load_time: item.metrics?.loadTime || item.metrics?.load_time || "0s" },
              live_url: item.liveUrl || item.live_url || "",
              featured: item.featured || false, has_video: item.hasVideo || item.has_video || false,
              status: item.status || "published",
            }),
          });
        }
        alert("Import complete!");
        await refetch();
      } catch { alert("Failed to parse or upload backup file"); }
      finally { setIsSubmitting(false); }
    };
    reader.readAsText(file);
  };

  React.useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => {
        const ct = res.headers.get("content-type");
        return res.ok && ct && ct.includes("application/json") ? true : false;
      })
      .then(setNeonConnected)
      .catch(() => setNeonConnected(false));
  }, []);

  // Run DB migration once on mount (idempotent)
  React.useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/migrate", { method: "POST" }).catch(() => {});
    }
  }, [isAuthenticated]);

  const activeProject = localProjects.find((p) => p.id === activeId);

  // ── Login Screen ────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <ElegantNavigation />
        <div className="flex-1 flex items-center justify-center px-4 relative py-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-beige/10 rounded-full filter blur-[128px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full filter blur-[128px] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-black/85 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl relative z-10"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Admin <span className="text-beige">Access</span></h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Enter Admin Password</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-beige/50 transition-all"
                />
              </div>
              {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
              <button type="submit" className="w-full py-3 bg-beige hover:bg-beige/95 text-charcoal font-bold rounded-lg transition-all shadow-lg">
                Unlock Dashboard
              </button>
            </form>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white">
      <ElegantNavigation />

      {/* Header */}
      <section className="relative py-20 px-8 bg-black overflow-hidden border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </button>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="text-4xl md:text-6xl font-bold mb-4">
            Admin <span className="text-beige">Dashboard</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }} className="text-xl text-gray-400 mb-8 max-w-3xl">
            Manage your portfolio projects, drag to reorder them, upload images, and control every detail.
          </motion.p>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-beige text-charcoal shadow-lg"
                    : "bg-black/60 backdrop-blur-md text-gray-400 hover:bg-black/80 border border-white/10 hover:border-white/20"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-black relative">
        <div className="max-w-6xl mx-auto px-8">

          {/* ── PROJECTS TAB ── */}
          {activeTab === "projects" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">

              {/* Toolbar */}
              <div className="flex justify-between items-center bg-black/95 border border-white/10 rounded-xl p-6">
                <div>
                  <h3 className="text-xl font-bold">Portfolio Projects</h3>
                  <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
                    <GripVertical className="w-3.5 h-3.5" />
                    Drag the grip icon on each card to reorder
                    {isSavingOrder && <span className="text-beige ml-2 animate-pulse">• Saving order…</span>}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleExportBackup} className="flex items-center gap-2 px-4 py-2.5 bg-black/60 hover:bg-black/80 border border-white/15 hover:border-white/30 rounded-lg text-sm text-gray-300 transition-all">
                    <Download className="w-4 h-4" /> Export JSON
                  </button>
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-black/60 hover:bg-black/80 border border-white/15 hover:border-white/30 rounded-lg text-sm text-gray-300 cursor-pointer transition-all">
                    <Upload className="w-4 h-4" /> Import JSON
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>
                  <button onClick={openAddForm} className="flex items-center gap-2 px-5 py-2.5 bg-beige text-charcoal font-bold rounded-lg text-sm hover:bg-beige/90 transition-all shadow-md">
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                </div>
              </div>

              {/* Grid */}
              {projectsLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige" />
                </div>
              ) : projectsError ? (
                <div className="text-center text-red-400 py-10">Error: {projectsError}</div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={localProjects.map((p) => p.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {localProjects.map((project) => (
                        <SortableProjectCard
                          key={project.id}
                          project={project}
                          onEdit={openEditForm}
                          onDelete={handleDeleteProject}
                        />
                      ))}
                    </div>
                  </SortableContext>

                  {/* Ghost card while dragging */}
                  <DragOverlay>
                    {activeProject ? (
                      <div className="bg-black/90 border border-beige/40 rounded-xl overflow-hidden shadow-2xl opacity-95 rotate-1">
                        <div className="relative h-36 bg-gray-900">
                          <img src={activeProject.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <p className="font-bold text-sm text-white">{activeProject.title}</p>
                          <p className="text-xs text-beige mt-1">{activeProject.brand}</p>
                        </div>
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </motion.div>
          )}

          {/* ── DRIVE TAB ── */}
          {activeTab === "drive" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <GoogleDriveSync />
            </motion.div>
          )}

          {/* ── DATABASE TAB ── */}
          {activeTab === "database" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-black/90 rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold">Database Management</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-black/40 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Neon Connection (PostgreSQL)</h4>
                  <p className="text-gray-400 text-sm">
                    {neonConnected === null ? "Checking connection…" : neonConnected
                      ? "Successfully connected to Neon Serverless PostgreSQL."
                      : "Connection failed. Check your DATABASE_URL environment variable."}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${neonConnected === null ? "bg-yellow-400" : neonConnected ? "bg-green-400" : "bg-red-500"}`} />
                    <span className={`text-sm ${neonConnected === null ? "text-yellow-400" : neonConnected ? "text-green-400" : "text-red-400"}`}>
                      {neonConnected === null ? "Checking…" : neonConnected ? "Connected" : "Connection Failed"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-black/90 rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <SettingsIcon className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold">Settings</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-black/40 rounded-lg">
                  <h4 className="font-medium text-white mb-2">API Configuration</h4>
                  <p className="text-gray-400 text-sm mb-3">Google Drive API keys are stored in your browser.</p>
                  <button
                    onClick={() => { localStorage.removeItem("googleDriveApiKey"); localStorage.removeItem("googleDriveFolderId"); alert("Stored credentials cleared"); }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Clear Stored Credentials
                  </button>
                </div>
                <div className="p-4 bg-black/40 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Environment</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Neon Database:</span>
                    <span className={neonConnected ? "text-green-400" : "text-gray-400"}>{neonConnected ? "Enabled ✓" : "Disabled"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── EDIT / ADD MODAL ── */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] bg-black/80"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div className="flex items-start justify-center min-h-full p-4 pt-16 overflow-y-auto">
            <div
              className="bg-[#0a0a0a] border border-white/15 rounded-xl w-full max-w-2xl shadow-2xl relative mb-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-6 flex justify-between items-center rounded-t-xl z-10">
                <h3 className="text-xl font-bold">
                  {editingProject ? "Edit Project Details" : "Create New Project"}
                </h3>
                <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="p-6 space-y-5">

                {/* Title + Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Project Title</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Kotn - Sustainable Fashion" className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Brand / Client</label>
                    <input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Kotn" className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Description</label>
                  <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter detailed description…" className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm resize-none transition-colors" />
                </div>

                {/* Live URL + Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-beige" /> Live URL</label>
                    <input type="url" required value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://brandname.com/" className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-beige" /> Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors">
                      {["Fashion","Beauty","Home & Garden","Food & Beverage","Jewelry","Sports & Outdoors","Health & Wellness"].map((c) => (
                        <option key={c} className="bg-black">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ImagePlus className="w-3.5 h-3.5 text-beige" /> Project Image
                  </label>
                  <ImageUpload value={image} onChange={setImage} />
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Tv className="w-3.5 h-3.5 text-beige" /> Project Video (Optional)</label>
                  <VideoUpload value={videoUrl} onChange={setVideoUrl} />
                </div>

                {/* Tags + Tech */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-beige" /> Tags</label>
                    <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Sustainable, Story-driven, Minimal" className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-beige" /> Tech Stack</label>
                    <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Shopify Plus, Custom App, React" className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors" />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><BarChart className="w-3.5 h-3.5 text-beige" /> Conversion Metric</label>
                    <input type="text" required value={conversionMetric} onChange={(e) => setConversionMetric(e.target.value)} placeholder="400%" className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><BarChart className="w-3.5 h-3.5 text-beige" /> Load Time Metric</label>
                    <input type="text" required value={loadTimeMetric} onChange={(e) => setLoadTimeMetric(e.target.value)} placeholder="0.6s" className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors" />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-6 pt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-beige cursor-pointer" />
                    Featured Case Study
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
                    <input type="checkbox" checked={hasVideo} onChange={(e) => setHasVideo(e.target.checked)} className="w-4 h-4 accent-beige cursor-pointer" />
                    Has Video Preview
                  </label>
                </div>

                {/* Actions */}
                <div className="border-t border-white/10 pt-5 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-sm text-gray-300 rounded-lg transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-beige text-charcoal font-bold rounded-lg text-sm hover:bg-beige/95 disabled:opacity-50 transition-all shadow-md">
                    {isSubmitting ? "Saving…" : "Save Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Admin;
