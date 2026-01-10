import { useState, useRef, type ChangeEvent } from "react";
import { HiPhotograph, HiUpload, HiX, HiLink } from "react-icons/hi";
import api from "../../helper/api";
interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}
export default function PosterUpload({
  value,
  onChange,
  label = "Afiş",
}: Props) {
  const [mode, setMode] = useState<"url" | "upload">(value ? "url" : "url");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setPreview(url);
  };
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const uploadedUrl = `http://localhost:3000/${response.data.path}`;
      onChange(uploadedUrl);
      setPreview(uploadedUrl);
    } catch (error) {
      console.error("Yükleme hatası:", error);
      setPreview("");
    } finally {
      setUploading(false);
    }
  };
  const clearImage = () => {
    onChange("");
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          <span className="text-gray-400 font-normal ml-1">(isteğe bağlı)</span>
        </label>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              mode === "url"
                ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            <HiLink className="text-sm" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              mode === "upload"
                ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            <HiUpload className="text-sm" />
            Yükle
          </button>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-24 h-36 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 relative">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Afiş önizleme"
                className="w-full h-full object-cover"
                onError={() => setPreview("")}
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <HiX className="text-xs" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <HiPhotograph className="text-2xl text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          {mode === "url" ? (
            <input
              type="url"
              value={value}
              onChange={handleUrlChange}
              placeholder="https://example.com/poster.jpg"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          ) : (
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="poster-upload"
              />
              <label
                htmlFor="poster-upload"
                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  uploading
                    ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {uploading ? (
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Yükleniyor...</span>
                  </div>
                ) : (
                  <>
                    <HiUpload className="text-2xl text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Görsel seçmek için tıklayın
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG, GIF, WEBP (max 5MB)
                    </span>
                  </>
                )}
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}