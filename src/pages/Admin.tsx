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
  History,
  RotateCcw,
  ExternalLink,
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
import { useSettings } from "../hooks/useSettings";
import { useTestimonials } from "../hooks/useTestimonials";
import GoogleDriveSync from "../components/GoogleDriveSync";
import { useProjects } from "../hooks/useProjects";

// ─── Sortable Project Card ───────────────────────────────────────────────────

interface ProjectCardProps {
  project: any;
  onEdit: (p: any) => void;
  onDelete: (id: string) => void;
  onClone: (p: any) => void;
  isDragging?: boolean;
}

const SortableProjectCard = ({ project, onEdit, onDelete, onClone }: ProjectCardProps) => {
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
          data-drag-handle
          className="absolute top-3 left-3 z-10 p-1.5 bg-black/70 rounded-lg cursor-grab active:cursor-grabbing text-gray-400 hover:text-white hover:bg-black/90 transition-all"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 pointer-events-none" />
        </div>

        <div>
          <div className="relative h-44 bg-gray-900">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-black/80 text-[10px] font-semibold text-beige border border-beige/30 rounded-full">
                {project.category}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                project.status === "draft"
                  ? "bg-amber-950/70 border-amber-500/40 text-amber-400"
                  : "bg-emerald-950/70 border-emerald-500/40 text-emerald-400"
              }`}>
                {project.status === "draft" ? "Draft" : "Published"}
              </span>
            </div>
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

        <div className="px-5 pb-5 border-t border-white/5 flex gap-2.5 mt-3 pt-3">
          <button
            onClick={() => onEdit(project)}
            className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 pointer-events-none" />
            Edit
          </button>
          <button
            onClick={() => onClone(project)}
            title="Duplicate Project"
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white rounded-lg text-xs font-medium flex items-center justify-center transition-colors"
          >
            <Plus className="w-3.5 h-3.5 pointer-events-none" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="px-3 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 rounded-lg text-xs font-medium flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
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

// ─── Multi Image Upload Component ──────────────────────────────────────────────

interface MultiImageUploadProps {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
}

interface SortablePhotoProps {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

const SortablePhoto = ({ url, index, onRemove }: SortablePhotoProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative aspect-video rounded-lg overflow-hidden border bg-gray-950 group cursor-grab active:cursor-grabbing transition-shadow duration-200 ${
        isDragging ? "border-beige/50 shadow-lg shadow-beige/10" : "border-white/10 hover:border-white/20"
      }`}
    >
      <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover pointer-events-none select-none" />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()} // stop propagation to prevent dragging on button press
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute top-1.5 right-1.5 z-10 w-5 h-5 bg-red-900/90 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
      >
        <X className="w-2.5 h-2.5" />
      </button>
      {index === 0 && (
        <span className="absolute bottom-1.5 left-1.5 bg-beige text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider pointer-events-none select-none">
          Hover Cover
        </span>
      )}
    </div>
  );
};

const MultiImageUpload = ({ value = [], onChange }: MultiImageUploadProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; name: string; progress: number }[]>([]);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Wait until pointer drags 8px so simple clicks aren't swallowed
      },
    })
  );

  const uploadFile = async (file: File, tempId: string) => {
    try {
      const signRes = await fetch("/api/cloudinary-sign", { method: "POST" });
      if (!signRes.ok) throw new Error("Failed to get signature");
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
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === tempId ? { ...f, progress: percent } : f))
          );
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
              reject(new Error("Upload failed"));
            }
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
      });

      xhr.send(formData);
      const data = await uploadPromise;

      const optimizedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_800/"
      );

      // Append new image URL safely using functional state update
      onChange((prev) => [...prev, optimizedUrl]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      // Remove from uploading list
      setUploadingFiles((prev) => prev.filter((f) => f.id !== tempId));
    }
  };

  const handleFiles = (files: FileList) => {
    setUploadError("");
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are allowed");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Image too large (max 10MB)");
        return;
      }

      const tempId = Math.random().toString(36).substring(7);
      setUploadingFiles((prev) => [...prev, { id: tempId, name: file.name, progress: 0 }]);
      uploadFile(file, tempId);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const removeImage = (indexToRemove: number) => {
    onChange((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    onChange((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(prev, oldIndex, newIndex);
      }
      return prev;
    });
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative w-full h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden ${
          isDraggingOver
            ? "border-beige/80 bg-beige/10"
            : "border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04]"
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-center px-4">
          <ImagePlus className={`w-8 h-8 ${isDraggingOver ? "text-beige" : "text-gray-500"}`} />
          <div>
            <p className="text-xs font-medium text-gray-300">
              Drag & drop images here or click to select multiple
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">JPG, PNG, WebP · No limit on count</p>
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />

      {uploadError && <p className="text-red-400 text-xs">{uploadError}</p>}

      {/* Upload Progress List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-2.5">
              <Loader2 className="w-3.5 h-3.5 text-beige animate-spin shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-300 truncate font-medium">{file.name}</p>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-beige h-full transition-all duration-150" style={{ width: `${file.progress}%` }} />
                </div>
              </div>
              <span className="text-[10px] text-gray-400 shrink-0 font-semibold">{file.progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Grid of thumbnails with Drag-and-Drop Sortable Context */}
      {value.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {value.map((url, i) => (
                <SortablePhoto key={url} url={url} index={i} onRemove={removeImage} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

// Custom PointerSensor subclass to only activate dragging on elements with data-drag-handle
class SmartPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent: event }: { nativeEvent: PointerEvent }) => {
        const element = event.target as HTMLElement;
        return !!element.closest("[data-drag-handle]");
      },
    },
  ];
}

interface LogEntry {
  id: string;
  action: string;
  description: string;
  category: "admin" | "github";
  payload?: any;
  author: string;
  created_at: string;
}

const AdminLogs = ({
  refetchSettings,
  refetchProjects,
}: {
  refetchSettings: () => Promise<any>;
  refetchProjects: () => Promise<any>;
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/logs");
      if (!res.ok) throw new Error("Failed to load logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleRestore = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to restore the system state to this snapshot? This will overwrite the current values."
      )
    ) {
      return;
    }
    setRestoringId(id);
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to restore state");

      alert(data.message || "State successfully restored!");

      // Refetch everything
      await Promise.all([refetchSettings(), refetchProjects()]);
      await fetchLogs();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to restore state");
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5 rounded-xl">
        <div>
          <h4 className="font-semibold text-white text-base flex items-center gap-2">
            <History className="w-5 h-5 text-beige" /> Activity Logs & Version History
          </h4>
          <p className="text-gray-400 text-xs mt-1">
            View changes made via the admin panel (with one-click rollbacks) and recent code updates from GitHub.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RotateCcw className="w-3.5 h-3.5" />
          )}
          Refresh
        </button>
      </div>

      {loading && logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 text-beige animate-spin" />
          <p className="text-xs text-gray-400">Loading audit feed and GitHub commits...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg text-xs text-center">
          {error}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-xs border border-white/5 rounded-xl bg-white/[0.01]">
          No activities logged yet.
        </div>
      ) : (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-black/60 backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="p-4 w-40">Date / Time</th>
                  <th className="p-4 w-36">Source</th>
                  <th className="p-4 w-48">Action</th>
                  <th className="p-4">Detail / Description</th>
                  <th className="p-4 w-36">Author</th>
                  <th className="p-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => {
                  const isGitHub = log.category === "github";
                  const dateStr = new Date(log.created_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });
                  const hasRestorablePayload = log.payload && log.payload.type;

                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 text-gray-400 font-mono whitespace-nowrap">{dateStr}</td>
                      <td className="p-4 whitespace-nowrap">
                        {isGitHub ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 text-blue-400 border border-blue-500/30">
                            GitHub Commit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                            Admin Settings
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-white whitespace-nowrap truncate max-w-[12rem]">
                        {log.action}
                      </td>
                      <td className="p-4 text-gray-300 font-medium leading-relaxed max-w-sm break-words">
                        {log.description}
                      </td>
                      <td className="p-4 text-gray-400 font-medium whitespace-nowrap">{log.author}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {isGitHub ? (
                          <a
                            href={log.payload?.commitUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-all hover:border-white/20 border border-transparent"
                          >
                            View Code <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : hasRestorablePayload ? (
                          <button
                            onClick={() => handleRestore(log.id)}
                            disabled={restoringId !== null}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-beige text-charcoal hover:bg-beige/90 rounded-lg font-bold transition-all disabled:opacity-50 shadow-md"
                          >
                            {restoringId === log.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3 h-3" />
                            )}
                            Revert
                          </button>
                        ) : (
                          <span className="text-gray-600 italic">No snapshot</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
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

  // ─── Settings and Testimonials Hooks ──────────────────────────────────────────
  const { settings, updateSetting, loading: settingsLoading, refetch: refetchSettings } = useSettings();
  const { testimonials, saveTestimonial, deleteTestimonial, updateTestimonialOrder, loading: testimonialsLoading, refetch: refetchTestimonials } = useTestimonials();

  // Sub-tabs under settings
  const [settingsSubTab, setSettingsSubTab] = useState<"general" | "navigation" | "testimonials" | "partners" | "system" | "logs">("general");
  const [partnersSubSubTab, setPartnersSubSubTab] = useState<"experts" | "tweets" | "instagram" | "showcases">("experts");

  // Local settings form states
  const [waNum, setWaNum] = useState("");
  const [tgHandle, setTgHandle] = useState("");
  const [copyrightText, setCopyrightText] = useState("");
  const [logoTxt, setLogoTxt] = useState("");
  const [supportMail, setSupportMail] = useState("");
  const [logoType, setLogoType] = useState<"text" | "image">("text");
  const [logoImg, setLogoImg] = useState("");
  const [faviconImg, setFaviconImg] = useState("");
  const [ogImg, setOgImg] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [logoTextWithImage, setLogoTextWithImage] = useState(false);
  const [enableSplashCursor, setEnableSplashCursor] = useState(false);
  const [localNav, setLocalNav] = useState<any[]>([]);
  const [localPartners, setLocalPartners] = useState<any>(null);

  // Sync settings states
  React.useEffect(() => {
    if (settings) {
      setWaNum(settings.socials.whatsapp || "");
      setTgHandle(settings.socials.telegram || "");
      setCopyrightText(settings.footer.copyright || "");
      setLogoTxt(settings.footer.logo_text || "");
      setSupportMail(settings.footer.email || "");
      setLogoType(settings.footer.logo_type || "text");
      setLogoImg(settings.footer.logo_image || "");
      setFaviconImg(settings.footer.favicon || "");
      setOgImg(settings.footer.social_share_image || "");
      setSeoTitle(settings.footer.seo_title || "");
      setSeoDescription(settings.footer.seo_description || "");
      setLogoTextWithImage(settings.footer.logo_text_with_image || false);
      setEnableSplashCursor(settings.footer.enable_splash_cursor || false);
      setLocalNav(settings.navigation || []);
      setLocalPartners(settings.partners || null);
    }
  }, [settings]);

  // Testimonials modal states
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [tAuthor, setTAuthor] = useState("");
  const [tRole, setTRole] = useState("");
  const [tCompany, setTCompany] = useState("");
  const [tQuote, setTQuote] = useState("");
  const [tAvatar, setTAvatar] = useState("");
  const [tRating, setTRating] = useState(5);
  const [tMetric, setTMetric] = useState("");
  const [tIndustry, setTIndustry] = useState("");
  const [tVerified, setTVerified] = useState(true);
  const [tSortOrder, setTSortOrder] = useState(0);

  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    const success1 = await updateSetting("socials", {
      whatsapp: waNum,
      telegram: tgHandle
    });
    const success2 = await updateSetting("footer", {
      copyright: copyrightText,
      logo_text: logoTxt,
      email: supportMail,
      logo_type: logoType,
      logo_image: logoImg,
      favicon: faviconImg,
      social_share_image: ogImg,
      seo_title: seoTitle,
      seo_description: seoDescription,
      logo_text_with_image: logoTextWithImage,
      enable_splash_cursor: enableSplashCursor
    });
    setIsSavingSettings(false);
    if (success1 && success2) {
      alert("General settings saved successfully!");
    } else {
      alert("Failed to save some settings.");
    }
  };

  const handleSaveNavigation = async () => {
    setIsSavingSettings(true);
    const success = await updateSetting("navigation", localNav);
    setIsSavingSettings(false);
    if (success) {
      alert("Navigation menu saved successfully!");
    } else {
      alert("Failed to save navigation menu.");
    }
  };

  const handleSavePartners = async () => {
    setIsSavingSettings(true);
    const success = await updateSetting("partners", localPartners);
    setIsSavingSettings(false);
    if (success) {
      alert("Partners page content saved successfully!");
    } else {
      alert("Failed to save partners content.");
    }
  };

  const handleAddTestimonial = () => {
    setEditingTestimonial(null);
    setTAuthor("");
    setTRole("");
    setTCompany("");
    setTQuote("");
    setTAvatar("");
    setTRating(5);
    setTMetric("");
    setTIndustry("");
    setTVerified(true);
    setTSortOrder(testimonials.length);
    setShowTestimonialForm(true);
  };

  const handleEditTestimonial = (t: any) => {
    setEditingTestimonial(t);
    setTAuthor(t.author || "");
    setTRole(t.role || "");
    setTCompany(t.company || "");
    setTQuote(t.quote || "");
    setTAvatar(t.avatar || "");
    setTRating(t.rating || 5);
    setTMetric(t.metric || "");
    setTIndustry(t.industry || "");
    setTVerified(t.verified !== false);
    setTSortOrder(t.sort_order || 0);
    setShowTestimonialForm(true);
  };

  const handleSaveTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveTestimonial({
        id: editingTestimonial?.id,
        author: tAuthor,
        role: tRole,
        company: tCompany,
        quote: tQuote,
        avatar: tAvatar,
        rating: Number(tRating),
        metric: tMetric,
        industry: tIndustry,
        verified: tVerified,
        sort_order: Number(tSortOrder)
      });
      setShowTestimonialForm(false);
      alert("Testimonial saved successfully!");
    } catch (err) {
      alert("Failed to save testimonial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestimonialClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const success = await deleteTestimonial(id);
    if (success) {
      alert("Testimonial deleted successfully!");
    } else {
      alert("Failed to delete testimonial.");
    }
  };

  // Local ordered list for drag-and-drop
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  const [originalOrder, setOriginalOrder] = useState<any[]>([]);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Sync localProjects and originalOrder when rawProjects changes
  React.useEffect(() => {
    setLocalProjects(rawProjects);
    setOriginalOrder(rawProjects);
    setIsOrderChanged(false);
  }, [rawProjects]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(SmartPointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localProjects.findIndex((p) => p.id === active.id);
    const newIndex = localProjects.findIndex((p) => p.id === over.id);
    const newOrder = arrayMove(localProjects, oldIndex, newIndex);
    setLocalProjects(newOrder);
    setIsOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      const res = await fetch("/api/portfolio-order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: localProjects.map((p) => p.id) }),
      });
      if (!res.ok) throw new Error("Failed to save layout order");
      await refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save order");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleCancelOrderChange = () => {
    setLocalProjects(originalOrder);
    setIsOrderChanged(false);
  };

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
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

  // Custom Category States
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  const allCategories = React.useMemo(() => {
    const defaultCats = [
      "Fashion",
      "Beauty",
      "Home & Garden",
      "Food & Beverage",
      "Jewelry",
      "Sports & Outdoors",
      "Health & Wellness",
    ];
    const uniqueFromProjects = Array.from(
      new Set(localProjects.map((p) => p.category).filter(Boolean))
    );
    return Array.from(new Set([...defaultCats, ...uniqueFromProjects]));
  }, [localProjects]);

  const handleCategoryChange = (val: string) => {
    if (val === "CUSTOM_NEW") {
      setShowCustomCategory(true);
      setCategory("");
    } else {
      setShowCustomCategory(false);
      setCategory(val);
    }
  };

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
    setTitle(""); setBrand(""); setDescription(""); setImage(""); setImages([]); setVideoUrl("");
    setCategory("Fashion"); setTagsInput(""); setTechInput("");
    setConversionMetric("350%"); setLoadTimeMetric("0.6s");
    setLiveUrl(""); setFeatured(false); setHasVideo(false); setStatus("published");
    setShowCustomCategory(false);
    setCustomCategoryInput("");
    setShowForm(true);
  };

  const openEditForm = (project: any) => {
    setEditingProject(project);
    setTitle(project.title || "");
    setBrand(project.brand || "");
    setDescription(project.description || "");
    setImage(project.image || "");
    setImages(project.images || []);
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
    setShowCustomCategory(false);
    setCustomCategoryInput("");
    setShowForm(true);
  };

  const handleCloneProject = (project: any) => {
    setEditingProject(null); // Cloning creates a new project!
    setTitle(`${project.title || ""} (Copy)`);
    setBrand(project.brand || "");
    setDescription(project.description || "");
    setImage(project.image || "");
    setImages(project.images || []);
    setVideoUrl(project.videoUrl || "");
    setCategory(project.category || "Fashion");
    setTagsInput((project.tags || []).join(", "));
    setTechInput((project.tech || []).join(", "));
    setConversionMetric(project.metrics?.conversion || "0%");
    setLoadTimeMetric(project.metrics?.loadTime || "0s");
    setLiveUrl(project.liveUrl || "");
    setFeatured(project.featured || false);
    setHasVideo(project.hasVideo || false);
    setStatus("draft"); // Default duplicated project to Draft for safety!
    setShowCustomCategory(false);
    setCustomCategoryInput("");
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
      images,
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

              {isOrderChanged && (
                <div className="flex flex-col sm:flex-row justify-between items-center bg-beige/10 border border-beige/30 rounded-xl p-5 text-sm gap-4 transition-all animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-beige opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-beige"></span>
                    </span>
                    <span className="text-gray-300 font-medium">Layout order changed. Save changes to apply to your portfolio website.</span>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleCancelOrderChange}
                      className="flex-1 sm:flex-initial px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 rounded-lg text-xs font-semibold transition-all"
                    >
                      Revert Changes
                    </button>
                    <button
                      onClick={handleSaveOrder}
                      disabled={isSavingOrder}
                      className="flex-1 sm:flex-initial px-5 py-2 bg-beige hover:bg-beige/90 text-charcoal font-bold rounded-lg text-xs transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isSavingOrder ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Layout Order"
                      )}
                    </button>
                  </div>
                </div>
              )}

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
                          onClone={handleCloneProject}
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-6 h-6 text-beige" />
                  <h3 className="text-xl font-bold text-white">Site Settings</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["general", "navigation", "testimonials", "partners", "system", "logs"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSettingsSubTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        settingsSubTab === tab
                          ? "bg-beige text-charcoal shadow-md"
                          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* General Settings Sub-tab */}
              {settingsSubTab === "general" && (
                <form onSubmit={handleSaveGeneralSettings} className="space-y-6">
                  {/* Logo Configuration */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-semibold text-beige tracking-wider uppercase mb-1">Logo Customization</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Logo Type</label>
                        <div className="flex gap-2">
                          {(["text", "image"] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setLogoType(type)}
                              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                                logoType === type
                                  ? "bg-beige text-charcoal border-beige shadow-md font-bold"
                                  : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {type === "text" ? "Text Initials Logo" : "Custom Image Logo"}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Logo Text / Brand Name</label>
                        <input
                          type="text"
                          value={logoTxt}
                          onChange={(e) => setLogoTxt(e.target.value)}
                          placeholder="Dev Studio"
                          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                        />
                        <span className="text-[10px] text-gray-500 mt-1 block">Used as fallback logo text, footer copyright brand, and alt text for accessibility.</span>
                      </div>
                    </div>

                    {logoType === "image" && (
                      <div className="pt-2 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Upload Custom Logo Image</label>
                          <ImageUpload
                            value={logoImg}
                            onChange={(url) => setLogoImg(url)}
                          />
                        </div>
                        <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 rounded-lg p-3">
                          <input
                            type="checkbox"
                            id="logoTextWithImage"
                            checked={logoTextWithImage}
                            onChange={(e) => setLogoTextWithImage(e.target.checked)}
                            className="w-4 h-4 accent-beige cursor-pointer"
                          />
                          <label htmlFor="logoTextWithImage" className="text-xs font-medium text-gray-300 cursor-pointer select-none">
                            Show brand name / logo text next to the logo image
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Brand Assets (Favicon & Open Graph Image) */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-semibold text-beige tracking-wider uppercase mb-1">Branding Assets</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Browser Favicon</label>
                        <ImageUpload
                          value={faviconImg}
                          onChange={(url) => setFaviconImg(url)}
                        />
                        <span className="text-[10px] text-gray-500 mt-1 block">Standard ICO, PNG, or SVG icon file. Appears in browser tab.</span>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Social Share / OG Image (Social Icon)</label>
                        <ImageUpload
                          value={ogImg}
                          onChange={(url) => setOgImg(url)}
                        />
                        <span className="text-[10px] text-gray-500 mt-1 block">Preview image displayed when link is shared on WhatsApp, Telegram, Twitter, etc.</span>
                      </div>
                    </div>
                  </div>

                  {/* Search Engine Optimization & Social Sharing */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-semibold text-beige tracking-wider uppercase mb-1">Social Sharing & SEO</h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left: Snippet Preview Card */}
                      <div className="lg:col-span-4 bg-white/[0.01] border border-white/10 rounded-xl p-4 space-y-3">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Share Preview</span>
                        <div className="bg-black/45 border border-white/5 rounded-lg overflow-hidden shadow-xl">
                          {/* Image preview */}
                          <div className="aspect-[1.91/1] w-full bg-white/[0.02] relative flex items-center justify-center border-b border-white/5">
                            {ogImg ? (
                              <img src={ogImg} alt="Share preview" className="w-full h-full object-cover" />
                            ) : faviconImg ? (
                              <img src={faviconImg} alt="Share preview" className="w-12 h-12 object-contain opacity-40" />
                            ) : (
                              <span className="text-[10px] text-gray-600">No image uploaded</span>
                            )}
                          </div>
                          {/* Text preview */}
                          <div className="p-3.5 space-y-1 bg-black/20">
                            <span className="text-[9px] text-gray-500 block uppercase tracking-wider">shopifydevstudio.com</span>
                            <h5 className="text-xs font-bold text-white line-clamp-1">
                              {seoTitle || logoTxt || "Shopify Dev Studio"}
                            </h5>
                            <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                              {seoDescription || "Custom Shopify themes, performance optimization, and conversion-focused development."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Inputs */}
                      <div className="lg:col-span-8 space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Home Page Title</label>
                            <span className={`text-[10px] ${seoTitle.length > 70 ? "text-red-400" : "text-gray-500"}`}>
                              {seoTitle.length} of 70 characters used
                            </span>
                          </div>
                          <input
                            type="text"
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            placeholder="Shopify Dev Studio | Custom Shopify Theme Development"
                            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Meta Description</label>
                            <span className={`text-[10px] ${seoDescription.length > 320 ? "text-red-400" : "text-gray-500"}`}>
                              {seoDescription.length} of 320 characters used
                            </span>
                          </div>
                          <textarea
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            rows={3}
                            placeholder="Custom Shopify themes and speed optimization that convert. We build high-performing storefronts for growing brands."
                            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactivity & Effects */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-semibold text-beige tracking-wider uppercase mb-1">Interactivity & Effects</h4>
                    <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 rounded-lg p-3">
                      <input
                        type="checkbox"
                        id="enableSplashCursor"
                        checked={enableSplashCursor}
                        onChange={(e) => setEnableSplashCursor(e.target.checked)}
                        className="w-4 h-4 accent-beige cursor-pointer"
                      />
                      <div>
                        <label htmlFor="enableSplashCursor" className="text-xs font-semibold text-gray-200 cursor-pointer select-none">
                          Enable Banner Fluid Splash Cursor
                        </label>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          When enabled, a colorful interactive liquid fluid effect will follow the mouse cursor over the home page banner. Optimized for high performance.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact & Copyright Info */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-semibold text-beige tracking-wider uppercase mb-1">Contact & Copyright</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Support Email</label>
                        <input
                          type="email"
                          value={supportMail}
                          onChange={(e) => setSupportMail(e.target.value)}
                          placeholder="shopifydevstudioo@gmail.com"
                          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">WhatsApp Contact Number</label>
                        <input
                          type="text"
                          value={waNum}
                          onChange={(e) => setWaNum(e.target.value)}
                          placeholder="+917487080421"
                          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                        />
                        <span className="text-[10px] text-gray-500 mt-1 block">Include country code without spaces or symbols (e.g. +917487080421)</span>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Telegram Username</label>
                        <input
                          type="text"
                          value={tgHandle}
                          onChange={(e) => setTgHandle(e.target.value)}
                          placeholder="prime2357"
                          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                        />
                        <span className="text-[10px] text-gray-500 mt-1 block">Your Telegram username without @ symbol</span>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Copyright Text</label>
                        <input
                          type="text"
                          value={copyrightText}
                          onChange={(e) => setCopyrightText(e.target.value)}
                          placeholder="© 2026 Shopifydevstudio. All rights reserved."
                          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-6 py-2.5 bg-beige text-charcoal font-bold rounded-lg text-sm hover:bg-beige/95 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
                    >
                      {isSavingSettings ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        "Save General Settings"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Navigation Settings Sub-tab */}
              {settingsSubTab === "navigation" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white">Header Navigation Menu</h4>
                      <p className="text-gray-400 text-sm">Configure the links in the header navigation menu.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = `custom-${Date.now()}`;
                        setLocalNav([...localNav, { id: newId, label: "New Link" }]);
                      }}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-beige/10 hover:border-beige/30 text-beige hover:text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Menu Item
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {localNav.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:border-white/20"
                      >
                        <span className="text-xs text-gray-500 font-mono w-6 text-center">{index + 1}</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Link Label</label>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => {
                                const updated = [...localNav];
                                updated[index] = { ...updated[index], label: e.target.value };
                                setLocalNav(updated);
                              }}
                              placeholder="e.g. Services"
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-beige/40 text-sm transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Target Element ID / URL</label>
                            <input
                              type="text"
                              value={item.id}
                              onChange={(e) => {
                                const updated = [...localNav];
                                updated[index] = { ...updated[index], id: e.target.value };
                                setLocalNav(updated);
                              }}
                              placeholder="e.g. services"
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-beige/40 text-sm transition-colors"
                            />
                          </div>
                        </div>

                        {/* Reorder and Delete Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => {
                              if (index === 0) return;
                              const updated = [...localNav];
                              const temp = updated[index];
                              updated[index] = updated[index - 1];
                              updated[index - 1] = temp;
                              setLocalNav(updated);
                            }}
                            className="p-1.5 bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white rounded disabled:opacity-30 transition-colors"
                            title="Move Up"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            disabled={index === localNav.length - 1}
                            onClick={() => {
                              if (index === localNav.length - 1) return;
                              const updated = [...localNav];
                              const temp = updated[index];
                              updated[index] = updated[index + 1];
                              updated[index + 1] = temp;
                              setLocalNav(updated);
                            }}
                            className="p-1.5 bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white rounded disabled:opacity-30 transition-colors"
                            title="Move Down"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Remove this navigation item?")) {
                                setLocalNav(localNav.filter((_, i) => i !== index));
                              }
                            }}
                            className="p-1.5 bg-red-950/20 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {localNav.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-xl">
                        No navigation items. Click "Add Menu Item" to start.
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleSaveNavigation}
                      disabled={isSavingSettings}
                      className="px-6 py-2.5 bg-beige text-charcoal font-bold rounded-lg text-sm hover:bg-beige/95 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
                    >
                      {isSavingSettings ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        "Save Navigation Menu"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Testimonials Settings Sub-tab */}
              {settingsSubTab === "testimonials" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white">Client Testimonials</h4>
                      <p className="text-gray-400 text-sm">Manage the customer feedback cards shown in the collaboration section.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTestimonial}
                      className="px-4 py-2 bg-beige text-charcoal font-bold rounded-lg text-sm hover:bg-beige/95 transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Testimonial
                    </button>
                  </div>

                  {/* Testimonial List Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {testimonials.map((t, index) => (
                      <div
                        key={t.id || index}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-white/20 transition-all group relative"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-3">
                              {t.avatar ? (
                                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-beige/40 bg-gray-900" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-beige/10 border border-beige/30 flex items-center justify-center font-bold text-beige text-sm">
                                  {t.author ? t.author.charAt(0) : "T"}
                                </div>
                              )}
                              <div>
                                <h5 className="font-medium text-white text-sm flex items-center gap-1.5">
                                  {t.author}
                                  {t.verified && (
                                    <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded-full">
                                      Verified
                                    </span>
                                  )}
                                </h5>
                                <p className="text-xs text-gray-400">{t.role} {t.company ? `@ ${t.company}` : ""}</p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-beige bg-beige/10 px-2 py-0.5 rounded border border-beige/20 font-mono">
                              {t.rating} ★
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 italic line-clamp-3 mb-4">"{t.quote}"</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                          <div className="flex flex-col gap-0.5">
                            {t.metric && (
                              <span className="text-[10px] text-gray-400">
                                Metric: <span className="text-white font-medium">{t.metric}</span>
                              </span>
                            )}
                            {t.industry && (
                              <span className="text-[10px] text-gray-400">
                                Industry: <span className="text-white font-medium">{t.industry}</span>
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Reorder Buttons */}
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={async () => {
                                if (index === 0) return;
                                const orderedIds = testimonials.map(item => item.id);
                                const temp = orderedIds[index];
                                orderedIds[index] = orderedIds[index - 1];
                                orderedIds[index - 1] = temp;
                                await updateTestimonialOrder(orderedIds);
                              }}
                              className="p-1 bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white rounded disabled:opacity-30 transition-colors"
                              title="Move Left/Up"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              disabled={index === testimonials.length - 1}
                              onClick={async () => {
                                if (index === testimonials.length - 1) return;
                                const orderedIds = testimonials.map(item => item.id);
                                const temp = orderedIds[index];
                                orderedIds[index] = orderedIds[index + 1];
                                orderedIds[index + 1] = temp;
                                await updateTestimonialOrder(orderedIds);
                              }}
                              className="p-1 bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white rounded disabled:opacity-30 transition-colors"
                              title="Move Right/Down"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEditTestimonial(t)}
                              className="p-1.5 bg-white/5 border border-white/10 hover:bg-beige/20 hover:border-beige/40 text-beige hover:text-white rounded-lg transition-colors"
                              title="Edit Testimonial"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTestimonialClick(t.id)}
                              className="p-1.5 bg-red-950/20 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                              title="Delete Testimonial"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {testimonials.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-xl">
                        No testimonials found. Click "Add Testimonial" to create one.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {settingsSubTab === "partners" && !localPartners && (
                <div className="text-center py-12 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-beige" />
                  Loading partners content...
                </div>
              )}

              {settingsSubTab === "partners" && localPartners && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h4 className="font-semibold text-white">Partners Page Manager</h4>
                      <p className="text-gray-400 text-sm">Customize sections of the Verified Partners page.</p>
                    </div>
                    
                    {/* Sub-sub-tabs */}
                    <div className="flex flex-wrap gap-2">
                      {(["experts", "tweets", "instagram", "showcases"] as const).map((subTab) => (
                        <button
                          key={subTab}
                          type="button"
                          onClick={() => setPartnersSubSubTab(subTab)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            partnersSubSubTab === subTab
                              ? "bg-beige/20 text-beige border border-beige/40"
                              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                          }`}
                        >
                          {subTab.charAt(0).toUpperCase() + subTab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1. Experts List Editor */}
                  {partnersSubSubTab === "experts" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-semibold text-beige">Verified Shopify Experts & Leaders</h5>
                        <button
                          type="button"
                          onClick={() => {
                            const newExpert = {
                              name: "New Expert",
                              title: "Consultant / Designer",
                              company: "Ecom Agency",
                              avatar: "",
                              verified: true,
                              hook: "100+ stores built",
                              achievement: "Ecom Developer Specialist",
                              comment: "Outstanding technical depth and custom Shopify Plus development capabilities.",
                              linkedinUrl: "",
                              website: "",
                              instagramHandle: "",
                              twitterHandle: ""
                            };
                            setLocalPartners({
                              ...localPartners,
                              experts: [...localPartners.experts, newExpert]
                            });
                          }}
                          className="px-2.5 py-1.5 bg-beige/10 hover:bg-beige/25 border border-beige/30 text-beige hover:text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Expert
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {localPartners.experts.map((exp: any, index: number) => (
                          <div key={index} className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs font-bold text-gray-400">Expert #{index + 1}: {exp.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm("Remove this expert?")) {
                                    const updated = localPartners.experts.filter((_: any, i: number) => i !== index);
                                    setLocalPartners({ ...localPartners, experts: updated });
                                  }
                                }}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Name</label>
                                <input
                                  type="text"
                                  value={exp.name}
                                  onChange={(e) => {
                                    const updated = [...localPartners.experts];
                                    updated[index] = { ...updated[index], name: e.target.value };
                                    setLocalPartners({ ...localPartners, experts: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Title</label>
                                <input
                                  type="text"
                                  value={exp.title}
                                  onChange={(e) => {
                                    const updated = [...localPartners.experts];
                                    updated[index] = { ...updated[index], title: e.target.value };
                                    setLocalPartners({ ...localPartners, experts: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Company</label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => {
                                    const updated = [...localPartners.experts];
                                    updated[index] = { ...updated[index], company: e.target.value };
                                    setLocalPartners({ ...localPartners, experts: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Avatar Image URL</label>
                                <input
                                  type="text"
                                  value={exp.avatar}
                                  onChange={(e) => {
                                    const updated = [...localPartners.experts];
                                    updated[index] = { ...updated[index], avatar: e.target.value };
                                    setLocalPartners({ ...localPartners, experts: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div className="flex items-center pt-4">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={exp.verified}
                                    onChange={(e) => {
                                      const updated = [...localPartners.experts];
                                      updated[index] = { ...updated[index], verified: e.target.checked };
                                      setLocalPartners({ ...localPartners, experts: updated });
                                    }}
                                    className="w-3.5 h-3.5 rounded border-white/15 bg-white/5 text-beige"
                                  />
                                  <span className="text-xs text-gray-300">Verified Badge</span>
                                </label>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Hook / Stats Text</label>
                                <input
                                  type="text"
                                  value={exp.hook}
                                  onChange={(e) => {
                                    const updated = [...localPartners.experts];
                                    updated[index] = { ...updated[index], hook: e.target.value };
                                    setLocalPartners({ ...localPartners, experts: updated });
                                  }}
                                  placeholder="500+ stores optimized"
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Achievement Text</label>
                                <input
                                  type="text"
                                  value={exp.achievement}
                                  onChange={(e) => {
                                    const updated = [...localPartners.experts];
                                    updated[index] = { ...updated[index], achievement: e.target.value };
                                    setLocalPartners({ ...localPartners, experts: updated });
                                  }}
                                  placeholder="Host of #1 Podcast"
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">LinkedIn URL</label>
                                <input
                                  type="text"
                                  value={exp.linkedinUrl}
                                  onChange={(e) => {
                                    const updated = [...localPartners.experts];
                                    updated[index] = { ...updated[index], linkedinUrl: e.target.value };
                                    setLocalPartners({ ...localPartners, experts: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Website URL</label>
                                <input
                                  type="text"
                                  value={exp.website}
                                  onChange={(e) => {
                                    const updated = [...localPartners.experts];
                                    updated[index] = { ...updated[index], website: e.target.value };
                                    setLocalPartners({ ...localPartners, experts: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Instagram Handle</label>
                                <input
                                  type="text"
                                  value={exp.instagramHandle}
                                  onChange={(e) => {
                                    const updated = [...localPartners.experts];
                                    updated[index] = { ...updated[index], instagramHandle: e.target.value };
                                    setLocalPartners({ ...localPartners, experts: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Twitter Handle</label>
                                <input
                                  type="text"
                                  value={exp.twitterHandle}
                                  onChange={(e) => {
                                    const updated = [...localPartners.experts];
                                    updated[index] = { ...updated[index], twitterHandle: e.target.value };
                                    setLocalPartners({ ...localPartners, experts: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Testimonial Quote / Comment</label>
                              <textarea
                                rows={2}
                                value={exp.comment}
                                onChange={(e) => {
                                  const updated = [...localPartners.experts];
                                  updated[index] = { ...updated[index], comment: e.target.value };
                                  setLocalPartners({ ...localPartners, experts: updated });
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Tweets List Editor */}
                  {partnersSubSubTab === "tweets" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-semibold text-beige">Verified Twitter Mentions</h5>
                        <button
                          type="button"
                          onClick={() => {
                            const newTweet = {
                              author: "New Expert",
                              handle: "expert_handle",
                              avatar: "",
                              time: "2h",
                              content: "Outstanding custom Shopify theme development by @shopifydevstudio. Highly recommend! 🚀",
                              replies: "0",
                              retweets: "0",
                              likes: "0"
                            };
                            setLocalPartners({
                              ...localPartners,
                              tweets: [...localPartners.tweets, newTweet]
                            });
                          }}
                          className="px-2.5 py-1.5 bg-beige/10 hover:bg-beige/25 border border-beige/30 text-beige hover:text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Tweet
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {localPartners.tweets.map((tw: any, index: number) => (
                          <div key={index} className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs font-bold text-gray-400">Tweet #{index + 1} by @{tw.handle}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm("Remove this tweet?")) {
                                    const updated = localPartners.tweets.filter((_: any, i: number) => i !== index);
                                    setLocalPartners({ ...localPartners, tweets: updated });
                                  }
                                }}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="col-span-2">
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Author Name</label>
                                <input
                                  type="text"
                                  value={tw.author}
                                  onChange={(e) => {
                                    const updated = [...localPartners.tweets];
                                    updated[index] = { ...updated[index], author: e.target.value };
                                    setLocalPartners({ ...localPartners, tweets: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Handle</label>
                                <input
                                  type="text"
                                  value={tw.handle}
                                  onChange={(e) => {
                                    const updated = [...localPartners.tweets];
                                    updated[index] = { ...updated[index], handle: e.target.value };
                                    setLocalPartners({ ...localPartners, tweets: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Time (e.g. 2h, 1d)</label>
                                <input
                                  type="text"
                                  value={tw.time}
                                  onChange={(e) => {
                                    const updated = [...localPartners.tweets];
                                    updated[index] = { ...updated[index], time: e.target.value };
                                    setLocalPartners({ ...localPartners, tweets: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Avatar Image URL</label>
                              <input
                                type="text"
                                value={tw.avatar}
                                onChange={(e) => {
                                  const updated = [...localPartners.tweets];
                                  updated[index] = { ...updated[index], avatar: e.target.value };
                                  setLocalPartners({ ...localPartners, tweets: updated });
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Tweet Content</label>
                              <textarea
                                rows={3}
                                value={tw.content}
                                onChange={(e) => {
                                  const updated = [...localPartners.tweets];
                                  updated[index] = { ...updated[index], content: e.target.value };
                                  setLocalPartners({ ...localPartners, tweets: updated });
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none focus:outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Replies Count</label>
                                <input
                                  type="text"
                                  value={tw.replies}
                                  onChange={(e) => {
                                    const updated = [...localPartners.tweets];
                                    updated[index] = { ...updated[index], replies: e.target.value };
                                    setLocalPartners({ ...localPartners, tweets: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Retweets Count</label>
                                <input
                                  type="text"
                                  value={tw.retweets}
                                  onChange={(e) => {
                                    const updated = [...localPartners.tweets];
                                    updated[index] = { ...updated[index], retweets: e.target.value };
                                    setLocalPartners({ ...localPartners, tweets: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Likes Count</label>
                                <input
                                  type="text"
                                  value={tw.likes}
                                  onChange={(e) => {
                                    const updated = [...localPartners.tweets];
                                    updated[index] = { ...updated[index], likes: e.target.value };
                                    setLocalPartners({ ...localPartners, tweets: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Instagram Posts Editor */}
                  {partnersSubSubTab === "instagram" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-semibold text-beige">Instagram Success Stories</h5>
                        <button
                          type="button"
                          onClick={() => {
                            const newInsta = {
                              username: "@brandname",
                              comment: "Incredible speed improvements! Page speed 0.7s and conversion rate +150%!",
                              likes: "1,200",
                              image: "",
                              website: "brand.com"
                            };
                            setLocalPartners({
                              ...localPartners,
                              instagram: [...localPartners.instagram, newInsta]
                            });
                          }}
                          className="px-2.5 py-1.5 bg-beige/10 hover:bg-beige/25 border border-beige/30 text-beige hover:text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Post
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {localPartners.instagram.map((ins: any, index: number) => (
                          <div key={index} className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs font-bold text-gray-400">Post #{index + 1} ({ins.username})</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm("Remove this Instagram post?")) {
                                    const updated = localPartners.instagram.filter((_: any, i: number) => i !== index);
                                    setLocalPartners({ ...localPartners, instagram: updated });
                                  }
                                }}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Username Handle</label>
                                <input
                                  type="text"
                                  value={ins.username}
                                  onChange={(e) => {
                                    const updated = [...localPartners.instagram];
                                    updated[index] = { ...updated[index], username: e.target.value };
                                    setLocalPartners({ ...localPartners, instagram: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Website Domain</label>
                                <input
                                  type="text"
                                  value={ins.website}
                                  onChange={(e) => {
                                    const updated = [...localPartners.instagram];
                                    updated[index] = { ...updated[index], website: e.target.value };
                                    setLocalPartners({ ...localPartners, instagram: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Likes Count</label>
                                <input
                                  type="text"
                                  value={ins.likes}
                                  onChange={(e) => {
                                    const updated = [...localPartners.instagram];
                                    updated[index] = { ...updated[index], likes: e.target.value };
                                    setLocalPartners({ ...localPartners, instagram: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Instagram Shared Photo URL</label>
                              <input
                                type="text"
                                value={ins.image}
                                onChange={(e) => {
                                  const updated = [...localPartners.instagram];
                                  updated[index] = { ...updated[index], image: e.target.value };
                                  setLocalPartners({ ...localPartners, instagram: updated });
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Post Caption Comment</label>
                              <textarea
                                rows={2}
                                value={ins.comment}
                                onChange={(e) => {
                                  const updated = [...localPartners.instagram];
                                  updated[index] = { ...updated[index], comment: e.target.value };
                                  setLocalPartners({ ...localPartners, instagram: updated });
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Case Study Showcases Editor */}
                  {partnersSubSubTab === "showcases" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-semibold text-beige">Work showcases / Case Studies</h5>
                        <button
                          type="button"
                          onClick={() => {
                            const newShowcase = {
                              storeName: "New Brand Store",
                              category: "E-Commerce",
                              beforeImage: "",
                              afterImage: "",
                              improvements: [
                                "Revenue: +50% growth",
                                "Speed: Load under 1s"
                              ],
                              testimonial: "Outstanding job rebuilding our storefront.",
                              clientRole: "Founder",
                              challenge: "Slow load times and bad UX",
                              solution: "Completely bespoke headless layout design",
                              websiteUrl: ""
                            };
                            setLocalPartners({
                              ...localPartners,
                              showcases: [...localPartners.showcases, newShowcase]
                            });
                          }}
                          className="px-2.5 py-1.5 bg-beige/10 hover:bg-beige/25 border border-beige/30 text-beige hover:text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Case Study
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {localPartners.showcases.map((sc: any, index: number) => (
                          <div key={index} className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs font-bold text-gray-400">Showcase #{index + 1} ({sc.storeName})</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm("Remove this case study showcase?")) {
                                    const updated = localPartners.showcases.filter((_: any, i: number) => i !== index);
                                    setLocalPartners({ ...localPartners, showcases: updated });
                                  }
                                }}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Store Name</label>
                                <input
                                  type="text"
                                  value={sc.storeName}
                                  onChange={(e) => {
                                    const updated = [...localPartners.showcases];
                                    updated[index] = { ...updated[index], storeName: e.target.value };
                                    setLocalPartners({ ...localPartners, showcases: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                                <input
                                  type="text"
                                  value={sc.category}
                                  onChange={(e) => {
                                    const updated = [...localPartners.showcases];
                                    updated[index] = { ...updated[index], category: e.target.value };
                                    setLocalPartners({ ...localPartners, showcases: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Website URL</label>
                                <input
                                  type="text"
                                  value={sc.websiteUrl}
                                  onChange={(e) => {
                                    const updated = [...localPartners.showcases];
                                    updated[index] = { ...updated[index], websiteUrl: e.target.value };
                                    setLocalPartners({ ...localPartners, showcases: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Before Image URL</label>
                                <input
                                  type="text"
                                  value={sc.beforeImage}
                                  onChange={(e) => {
                                    const updated = [...localPartners.showcases];
                                    updated[index] = { ...updated[index], beforeImage: e.target.value };
                                    setLocalPartners({ ...localPartners, showcases: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">After Image URL</label>
                                <input
                                  type="text"
                                  value={sc.afterImage}
                                  onChange={(e) => {
                                    const updated = [...localPartners.showcases];
                                    updated[index] = { ...updated[index], afterImage: e.target.value };
                                    setLocalPartners({ ...localPartners, showcases: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Challenge</label>
                                <textarea
                                  rows={2}
                                  value={sc.challenge}
                                  onChange={(e) => {
                                    const updated = [...localPartners.showcases];
                                    updated[index] = { ...updated[index], challenge: e.target.value };
                                    setLocalPartners({ ...localPartners, showcases: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Solution</label>
                                <textarea
                                  rows={2}
                                  value={sc.solution}
                                  onChange={(e) => {
                                    const updated = [...localPartners.showcases];
                                    updated[index] = { ...updated[index], solution: e.target.value };
                                    setLocalPartners({ ...localPartners, showcases: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Testimonial Quote</label>
                                <textarea
                                  rows={2}
                                  value={sc.testimonial}
                                  onChange={(e) => {
                                    const updated = [...localPartners.showcases];
                                    updated[index] = { ...updated[index], testimonial: e.target.value };
                                    setLocalPartners({ ...localPartners, showcases: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Client Role (Author)</label>
                                <input
                                  type="text"
                                  value={sc.clientRole}
                                  onChange={(e) => {
                                    const updated = [...localPartners.showcases];
                                    updated[index] = { ...updated[index], clientRole: e.target.value };
                                    setLocalPartners({ ...localPartners, showcases: updated });
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Improvements List */}
                            <div>
                              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Improvements (comma-separated list)</label>
                              <input
                                type="text"
                                value={(sc.improvements || []).join(", ")}
                                onChange={(e) => {
                                  const list = e.target.value.split(",").map(val => val.trim()).filter(Boolean);
                                  const updated = [...localPartners.showcases];
                                  updated[index] = { ...updated[index], improvements: list };
                                  setLocalPartners({ ...localPartners, showcases: updated });
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                placeholder="Revenue: +240%, Bounce rate: 45% -> 12%"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleSavePartners}
                      disabled={isSavingSettings}
                      className="px-6 py-2.5 bg-beige text-charcoal font-bold rounded-lg text-sm hover:bg-beige/95 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
                    >
                      {isSavingSettings ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        "Save Partners Content"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* System Settings Sub-tab */}
              {settingsSubTab === "system" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Google Drive API Configuration</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      The credentials for Google Drive image upload are stored securely in your browser's local storage.
                    </p>
                    <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-white block">Status</span>
                          <span className="text-xs text-gray-500">
                            {localStorage.getItem("googleDriveApiKey") ? "API Key stored" : "No API Key stored"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Are you sure you want to clear your stored credentials?")) {
                              localStorage.removeItem("googleDriveApiKey");
                              localStorage.removeItem("googleDriveFolderId");
                              alert("Stored credentials cleared");
                              window.location.reload();
                            }
                          }}
                          className="px-4 py-2 bg-red-600/20 hover:bg-red-600 border border-red-500/30 hover:border-red-600 text-red-200 hover:text-white rounded-lg text-sm transition-colors"
                        >
                          Clear Stored Credentials
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Database Environment Details</h4>
                    <div className="p-4 bg-black/40 border border-white/10 rounded-lg space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">PostgreSQL Provider:</span>
                        <span className="text-white font-medium font-mono">Neon Serverless</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Neon Status:</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${neonConnected ? "bg-green-400" : "bg-red-500"}`} />
                          <span className={neonConnected ? "text-green-400" : "text-red-400"}>
                            {neonConnected ? "Connected" : "Disconnected"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Logs Sub-tab */}
              {settingsSubTab === "logs" && (
                <AdminLogs refetchSettings={refetchSettings} refetchProjects={refetch} />
              )}
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
                    {!showCustomCategory ? (
                      <select 
                        value={category} 
                        onChange={(e) => handleCategoryChange(e.target.value)} 
                        className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                      >
                        {allCategories.map((c) => (
                          <option key={c} value={c} className="bg-black">{c}</option>
                        ))}
                        <option value="CUSTOM_NEW" className="bg-black text-beige font-semibold">+ Create Custom Category...</option>
                      </select>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={customCategoryInput}
                          onChange={(e) => {
                            setCustomCategoryInput(e.target.value);
                            setCategory(e.target.value);
                          }}
                          placeholder="Type custom category name..."
                          className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomCategory(false);
                            setCategory(allCategories[0] || "Fashion");
                          }}
                          className="px-3 bg-white/10 hover:bg-white/20 border border-white/15 text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ImagePlus className="w-3.5 h-3.5 text-beige" /> Project Cover Image
                  </label>
                  <ImageUpload value={image} onChange={setImage} />
                </div>

                {/* Multiple Images Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ImagePlus className="w-3.5 h-3.5 text-beige" /> Project Gallery (Optional)
                  </label>
                  <MultiImageUpload value={images} onChange={setImages} />
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
                    {tagsInput.split(",").map((t) => t.trim()).filter(Boolean).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {tagsInput.split(",").map((t) => t.trim()).filter(Boolean).map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 bg-beige/10 border border-beige/30 text-beige text-[11px] px-2 py-0.5 rounded-full">
                            {tag}
                            <button
                              type="button"
                              onClick={() => {
                                const list = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
                                const newList = list.filter((_, i) => i !== idx);
                                setTagsInput(newList.join(", "));
                              }}
                              className="hover:text-red-400 transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-beige" /> Tech Stack</label>
                    <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Shopify Plus, Custom App, React" className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors" />
                    {techInput.split(",").map((t) => t.trim()).filter(Boolean).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {techInput.split(",").map((t) => t.trim()).filter(Boolean).map((tech, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 bg-white/5 border border-white/15 text-gray-300 text-[11px] px-2 py-0.5 rounded-full">
                            {tech}
                            <button
                              type="button"
                              onClick={() => {
                                const list = techInput.split(",").map((t) => t.trim()).filter(Boolean);
                                const newList = list.filter((_, i) => i !== idx);
                                setTechInput(newList.join(", "));
                              }}
                              className="hover:text-red-400 transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
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
                {/* Toggles + Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
                      <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-beige cursor-pointer" />
                      Featured Case Study
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
                      <input type="checkbox" checked={hasVideo} onChange={(e) => setHasVideo(e.target.checked)} className="w-4 h-4 accent-beige cursor-pointer" />
                      Has Video Preview
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-beige" /> Project Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors">
                      <option value="published" className="bg-black text-green-400 font-semibold">Published (Visible on Live Grid)</option>
                      <option value="draft" className="bg-black text-orange-400 font-semibold">Draft (Hidden from Live Grid)</option>
                    </select>
                  </div>
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

      {/* ── TESTIMONIAL EDIT / ADD MODAL ── */}
      {showTestimonialForm && (
        <div
          className="fixed inset-0 z-[100] bg-black/80"
          onClick={(e) => { if (e.target === e.currentTarget) setShowTestimonialForm(false); }}
        >
          <div className="flex items-start justify-center min-h-full p-4 pt-16 overflow-y-auto">
            <div
              className="bg-[#0a0a0a] border border-white/15 rounded-xl w-full max-w-2xl shadow-2xl relative mb-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-6 flex justify-between items-center rounded-t-xl z-10">
                <h3 className="text-xl font-bold">
                  {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
                </h3>
                <button type="button" onClick={() => setShowTestimonialForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveTestimonialSubmit} className="p-6 space-y-5">
                {/* Author Name + Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Author Name</label>
                    <input
                      type="text"
                      required
                      value={tAuthor}
                      onChange={(e) => setTAuthor(e.target.value)}
                      placeholder="e.g. Sarah Chen"
                      className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Role / Position</label>
                    <input
                      type="text"
                      required
                      value={tRole}
                      onChange={(e) => setTRole(e.target.value)}
                      placeholder="e.g. UX/UI Design Lead"
                      className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Company + Avatar URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Company / Organization</label>
                    <input
                      type="text"
                      value={tCompany}
                      onChange={(e) => setTCompany(e.target.value)}
                      placeholder="e.g. Figma Community"
                      className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Avatar Image URL (Optional)</label>
                    <input
                      type="url"
                      value={tAvatar}
                      onChange={(e) => setTAvatar(e.target.value)}
                      placeholder="e.g. https://domain.com/avatar.jpg"
                      className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Quote */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Testimonial Quote</label>
                  <textarea
                    required
                    rows={4}
                    value={tQuote}
                    onChange={(e) => setTQuote(e.target.value)}
                    placeholder="Enter the client's testimonial quote..."
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm resize-none transition-colors"
                  />
                </div>

                {/* Metric + Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Key Metric / Result (Optional)</label>
                    <input
                      type="text"
                      value={tMetric}
                      onChange={(e) => setTMetric(e.target.value)}
                      placeholder="e.g. 50K+ Design Downloads"
                      className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Industry / Category (Optional)</label>
                    <input
                      type="text"
                      value={tIndustry}
                      onChange={(e) => setTIndustry(e.target.value)}
                      placeholder="e.g. Design"
                      className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Rating + Sort Order + Verified Checkbox */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Rating (Stars)</label>
                    <select
                      value={tRating}
                      onChange={(e) => setTRating(Number(e.target.value))}
                      className="w-full bg-[#0a0a0a] border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors font-sans"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Sort Order</label>
                    <input
                      type="number"
                      required
                      value={tSortOrder}
                      onChange={(e) => setTSortOrder(Number(e.target.value))}
                      placeholder="e.g. 0"
                      className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-beige/60 text-sm transition-colors"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={tVerified}
                        onChange={(e) => setTVerified(e.target.checked)}
                        className="w-4 h-4 rounded border-white/15 bg-white/5 text-beige focus:ring-beige/30"
                      />
                      <span className="text-sm font-semibold text-gray-300">Verified Client</span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-white/10 pt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTestimonialForm(false)}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-sm text-gray-300 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-beige text-charcoal font-bold rounded-lg text-sm hover:bg-beige/95 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save Testimonial"
                    )}
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
