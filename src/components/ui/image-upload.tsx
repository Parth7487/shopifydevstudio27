import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Image as ImageIcon,
  Link,
  Eye,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OptimizedImage from "@/components/OptimizedImage";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
  previewSize?: "sm" | "md" | "lg";
}

export const ImageUpload = ({
  value = "",
  onChange,
  label = "Image",
  placeholder = "Enter image URL or upload a file",
  className = "",
  accept = "image/*",
  maxSize = 5,
  previewSize = "md",
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<"url" | "upload">("url");
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewSizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  // Convert file to base64
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }

      setIsLoading(true);

      try {
        const base64 = await fileToBase64(file);
        onChange(base64);
        setUrlInput(base64);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [fileToBase64, maxSize, onChange],
  );

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Handle file input change
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload],
  );

  // Handle URL input
  const handleUrlChange = useCallback(
    (newUrl: string) => {
      setUrlInput(newUrl);
      onChange(newUrl);
    },
    [onChange],
  );

  // Clear image
  const clearImage = useCallback(() => {
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);

  // Get display URL (prioritize value prop over local state)
  const displayUrl = value || urlInput;
  const hasImage = displayUrl && displayUrl.trim() !== "";

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label and Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        <div className="flex border border-beige/20 rounded-lg overflow-hidden">
          <Button
            type="button"
            onClick={() => setInputMode("url")}
            variant={inputMode === "url" ? "default" : "ghost"}
            size="sm"
            className={`${
              inputMode === "url"
                ? "bg-beige text-black"
                : "text-beige hover:bg-beige/10"
            } border-none text-xs px-3 py-1`}
          >
            <Link className="w-3 h-3 mr-1" />
            URL
          </Button>
          <Button
            type="button"
            onClick={() => setInputMode("upload")}
            variant={inputMode === "upload" ? "default" : "ghost"}
            size="sm"
            className={`${
              inputMode === "upload"
                ? "bg-beige text-black"
                : "text-beige hover:bg-beige/10"
            } border-none text-xs px-3 py-1`}
          >
            <Upload className="w-3 h-3 mr-1" />
            Upload
          </Button>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        {inputMode === "url" ? (
          // URL Input Mode
          <div className="relative">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-graphite border border-beige/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-beige/50 pr-10"
            />
            {hasImage && (
              <Button
                type="button"
                onClick={clearImage}
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          // Upload Mode
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300
              ${
                isDragging
                  ? "border-beige bg-beige/5"
                  : "border-beige/30 hover:border-beige/50 hover:bg-beige/5"
              }
              ${isLoading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
            `}
            onClick={() => !isLoading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="space-y-3">
              <div className="flex justify-center">
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <RotateCw className="w-8 h-8 text-beige" />
                  </motion.div>
                ) : (
                  <Upload className="w-8 h-8 text-beige" />
                )}
              </div>

              <div>
                <p className="text-gray-300 font-medium">
                  {isLoading
                    ? "Uploading..."
                    : "Drop an image here or click to upload"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Supports JPG, PNG, GIF up to {maxSize}MB
                </p>
              </div>

              {isDragging && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 bg-beige/10 border-2 border-beige rounded-lg flex items-center justify-center"
                >
                  <p className="text-beige font-medium">Drop image here!</p>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image Preview */}
      <AnimatePresence>
        {hasImage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-charcoal/50 border-beige/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Image Preview */}
                  <div
                    className={`${previewSizes[previewSize]} flex-shrink-0 relative`}
                  >
                    {displayUrl.startsWith("data:") ||
                    displayUrl.startsWith("http") ? (
                      <OptimizedImage
                        src={displayUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg border border-beige/20"
                        width={
                          previewSize === "lg"
                            ? 128
                            : previewSize === "md"
                              ? 96
                              : 64
                        }
                        height={
                          previewSize === "lg"
                            ? 128
                            : previewSize === "md"
                              ? 96
                              : 64
                        }
                      />
                    ) : (
                      <div className="w-full h-full bg-graphite/50 rounded-lg border border-beige/20 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Image Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {displayUrl.startsWith("data:")
                            ? "Uploaded Image"
                            : "Image URL"}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {displayUrl.startsWith("data:")
                            ? `Base64 • ${Math.round(displayUrl.length / 1024)}KB`
                            : displayUrl}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-2">
                        {/* Preview Button */}
                        <Button
                          type="button"
                          onClick={() => window.open(displayUrl, "_blank")}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-beige p-1 h-auto"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {/* Remove Button */}
                        <Button
                          type="button"
                          onClick={clearImage}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-400 p-1 h-auto"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        {inputMode === "url"
          ? "Paste a direct link to an image (JPG, PNG, GIF)"
          : `Upload an image file (max ${maxSize}MB)`}
      </p>
    </div>
  );
};

export default ImageUpload;
