"use client";
import React, { useEffect, useState, useRef } from "react";
import Icon from "../icons/Icons";
import Editor from "@monaco-editor/react";
import { useSftpMode } from "../contextAPI/contextmode";
import { Toast } from "flowbite-react";

const formatModifyTime = (value: number | string | undefined) => {
  if (value === undefined || value === null) return "-";
  let num = typeof value === "string" ? parseInt(value, 10) : value;
  if (isNaN(num)) return "-";
  if (num < 1e12) num *= 1000;
  const date = new Date(num);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const getLanguageFromFile = (fileName: string) => {
  if (fileName.endsWith(".html")) return "html";
  if (fileName.endsWith(".js")) return "javascript";
  if (fileName.endsWith(".ts")) return "typescript";
  if (fileName.endsWith(".css")) return "css";
  if (fileName.endsWith(".json")) return "json";
  return "plaintext";
};

const sortFiles = (items: any[]) =>
  [...items].sort((a, b) => {
    const aIsDir = isDirectory(a);
    const bIsDir = isDirectory(b);
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

const isDirectory = (item: any) =>
  item.type === "d" || item.type === "directory";

const buildPath = (currentPath: string, name: string) =>
  currentPath === "." ? name : `${currentPath}/${name}`;

type FileManagerProps = {
  currentPath: string;
  onPathChange?: (path: string) => void;
  reloadKey?: number;
};

const DEMO_ROOT = ".";
const MEDIA_ROOT = "media";

const MODE_STYLES: Record<
  "demo" | "media",
  {
    headerBadge: string;
    pathBadge: string;
    folderIcon: string;
    desc: string;
  }
> = {
  media: {
    headerBadge: "bg-blue-500/10 border border-blue-500/40 text-blue-300",
    pathBadge: "bg-blue-600 text-white",
    folderIcon: "text-blue-300",
    desc: "Demo scripts / môi trường test, có thể ghi đè thoải mái.",
  },
  demo: {
    headerBadge:
      "bg-emerald-500/10 border border-emerald-500/40 text-emerald-300",
    pathBadge: "bg-emerald-600 text-white",
    folderIcon: "text-emerald-300",
    desc: "Media assets (hình ảnh, video) chạy thật, cẩn thận khi sửa.",
  },
};

const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

type ToastItem = {
  id: string;
  type: "success" | "error" | "info";
  title?: string;
  message: string;
};

const FileManager: React.FC<FileManagerProps> = ({
  currentPath,
  onPathChange,
  reloadKey,
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [openActionFor, setOpenActionFor] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [isVideoSmall, setIsVideoSmall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { mode: sftpMode, setMode: setSftpMode } = useSftpMode();
  const styles = MODE_STYLES[sftpMode];
  const objectUrlRef = useRef<string | null>(null);

  // -- Toast helpers -------------------------------------------------------
  const showToast = (
    type: ToastItem["type"],
    message: string,
    title?: string
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const item: ToastItem = { id, type, message, title };
    setToasts((prev) => [...prev, item]);

    // auto remove after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };
  // Thêm định nghĩa kiểu cho từng loại toast
  const TOAST_STYLES: Record<
    ToastItem["type"],
    {
      bg: string;
      text: string;
      icon: string;
      iconBg: string;
      // Có thể thêm icon component nếu bạn dùng thư viện icon
    }
  > = {
    success: {
      bg: "bg-emerald-200 dark:bg-emerald-800",
      text: "text-emerald-900 dark:text-emerald-100",
      icon: "✓", // hoặc dùng Icon name nếu có
      iconBg: "bg-white/10 text-emerald-400",
    },
    error: {
      bg: "bg-red-200 dark:bg-red-800",
      text: "text-red-900 dark:text-red-100",
      icon: "!",
      iconBg: "bg-white/10 text-red-400",
    },
    info: {
      bg: "bg-blue-200 dark:bg-blue-800",
      text: "text-blue-900 dark:text-blue-100",
      icon: "i",
      iconBg: "bg-white/10 text-blue-400",
    },
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  // -----------------------------------------------------------------------

  const loadFiles = async (path: string, mode?: "demo" | "media") => {
    setIsLoading(true);
    const effectiveMode = mode ?? sftpMode;
    try {
      const res = await fetch(
        `/api/sftp/list?path=${encodeURIComponent(path)}&mode=${effectiveMode}`
      );
      const data = await res.json();
      if (data.success) {
        setFiles(sortFiles(data.files));
        onPathChange?.(path);
      } else {
        showToast("error", data.error || "Không thể load file");
      }
    } catch (err: any) {
      console.error(err);
      showToast("error", err.message || "Lỗi khi load file");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(currentPath, sftpMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey, currentPath, sftpMode]);

  const handleFolderClick = (name: string) => {
    const newPath = buildPath(currentPath, name);
    onPathChange?.(newPath);
  };

  // preview bằng URL trực tiếp (không fetch JSON)
  const handlePreview = (fileName: string) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
      setObjectUrl(null);
    }

    const fullPath = buildPath(currentPath, fileName);
    const url = `/api/sftp/read?path=${encodeURIComponent(
      fullPath
    )}&mode=${sftpMode}`;
    setPreviewImage(url);
  };

  const handleRename = async (itemName: string, isDir: boolean) => {
    let newName = window.prompt("Nhập tên mới:", itemName);
    if (!newName) return;

    newName = newName.trim();

    if (isDir && newName.includes(".")) {
      showToast("error", "Folder không thể chứa dấu chấm (.) trong tên.");
      return;
    }

    if (!isDir && (newName.startsWith(".") || newName.endsWith("."))) {
      showToast("error", "Tên file không hợp lệ.");
      return;
    }

    if (!newName) {
      showToast("error", "Tên không được để trống.");
      return;
    }

    try {
      const res = await fetch(`/api/sftp/rename?mode=${sftpMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: currentPath,
          oldName: itemName,
          newName,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        showToast("error", "Rename lỗi: " + (data.error || "Unknown"));
        return;
      }

      showToast("success", `Đổi tên thành công: ${itemName} → ${newName}`);
      await loadFiles(currentPath);
    } catch (err: any) {
      showToast("error", "Có lỗi khi rename: " + err.message);
    }
  };

  const handleGoBack = () => {
    if (
      currentPath === "." ||
      currentPath === DEMO_ROOT ||
      currentPath === MEDIA_ROOT
    )
      return;
    const parts = currentPath.split("/");
    parts.pop();
    const parentPath = parts.join("/") || ".";
    onPathChange?.(parentPath);
  };

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(currentPath);
      showToast("success", "Đã copy path: " + currentPath);
    } catch (err: any) {
      console.error("Copy failed:", err);
      showToast("error", "Không thể copy path");
    }
  };

  // mở file text. Fallback: nếu API trả image, mở preview image (blob -> objectURL)
  const openTextFile = async (fileName: string) => {
    const filePath = buildPath(currentPath, fileName);
    try {
      const res = await fetch(
        `/api/sftp/read?path=${encodeURIComponent(filePath)}&mode=${sftpMode}`
      );

      const contentType = res.headers.get("Content-Type") || "";

      if (contentType.startsWith("image/")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        setObjectUrl(url);
        setPreviewImage(url);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setPreviewFile(fileName);
        setPreviewContent(data.content ?? "");
      } else {
        showToast("error", "Lỗi: " + (data.error || "Không đọc được file"));
      }
    } catch (err: any) {
      showToast("error", "Không thể đọc file: " + err.message);
    }
  };

  const openVideo = (filePath: string) => {
    setPreviewVideo(
      `/api/sftp/stream?path=${encodeURIComponent(filePath)}&mode=${sftpMode}`
    );
    setIsVideoSmall(false);
  };

  // mở item: folder / mp4 / image / text
  const openItem = (item: any, isDir: boolean) => {
    if (isDir) {
      handleFolderClick(item.name);
      return;
    }

    const ext = item.name.split(".").pop()?.toLowerCase();
    const filePath = buildPath(currentPath, item.name);

    if (ext === "mp4") {
      openVideo(filePath);
    } else if (ext && IMAGE_EXTS.includes(ext)) {
      handlePreview(item.name);
    } else {
      openTextFile(item.name);
    }
  };

  const handleSaveFile = async () => {
    if (!previewFile || previewContent === null) return;

    const filePath = buildPath(currentPath, previewFile);

    try {
      setIsSaving(true);
      const res = await fetch("/api/sftp/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: filePath,
          content: previewContent,
          mode: sftpMode,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        showToast("error", "Lưu file lỗi: " + (data.error || "Unknown"));
        return;
      }

      // Thành công → reload danh sách, đóng modal edit, show toast
      await loadFiles(currentPath);
      closePreview();
      showToast("success", "Đã lưu file thành công");
    } catch (err: any) {
      showToast("error", "Có lỗi khi lưu file: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const closePreview = () => {
    setPreviewContent(null);
    setPreviewFile(null);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
      setObjectUrl(null);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 mt-8">
      {/* Toast container (top-right) */}
      /* CODE MỚI */
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((t) => {
          const toastStyle = TOAST_STYLES[t.type];

          return (
            <div key={t.id} className="min-w-[240px]">
              <Toast
                className={`${toastStyle.bg} border-l-4 ${
                  t.type === "error"
                    ? "border-red-500"
                    : t.type === "success"
                    ? "border-emerald-500"
                    : "border-blue-500"
                }`}
              >
                {/* Icon */}
                <div
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${toastStyle.iconBg}`}
                >
                  <span className="font-bold">{toastStyle.icon}</span>
                </div>

                {/* Nội dung */}
                <div className={`ml-3 text-sm font-normal ${toastStyle.text}`}>
                  {t.title ? (
                    <div className="font-semibold">{t.title}</div>
                  ) : null}
                  <div>{t.message}</div>
                </div>

                {/* Nút đóng */}
                <div className="ml-auto">
                  <button
                    onClick={() => removeToast(t.id)}
                    className={`${toastStyle.text} opacity-70 hover:opacity-100 px-2`}
                  >
                    ✕
                  </button>
                </div>
              </Toast>
            </div>
          );
        })}
      </div>
      {/* HEADER: SFTP + MODE + PATH */}
      <div className="flex items-center justify-between mb-5 gap-4">
        {/* LEFT: SFTP + mode badge */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs uppercase tracking-wider">
              SFTP
            </span>

            <div className="flex bg-slate-900 rounded-full p-1">
              <button
                onClick={() => {
                  setSftpMode("demo");
                  onPathChange?.(DEMO_ROOT);
                }}
                className={`px-4 py-1 text-xs rounded-full transition font-medium ${
                  sftpMode === "demo"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                DEMO
              </button>
              <button
                onClick={() => {
                  setSftpMode("media");
                  onPathChange?.(MEDIA_ROOT);
                }}
                className={`px-4 py-1 text-xs rounded-full transition font-medium ${
                  sftpMode === "media"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                MEDIA
              </button>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mt-1 ${styles.headerBadge}`}
          >
            <span className="font-semibold uppercase">
              {sftpMode === "demo" ? "DEMO ENV" : "MEDIA STORAGE"}
            </span>
            <span className="text-[11px] opacity-80">{styles.desc}</span>
          </div>
        </div>

        {/* RIGHT: BACK + PATH + COPY */}
        <div className="flex items-center gap-3">
          {currentPath !== "." &&
            currentPath !== DEMO_ROOT &&
            currentPath !== MEDIA_ROOT && (
              <button
                onClick={handleGoBack}
                className="px-3 py-1.5 text-xs rounded-md 
                  bg-slate-700 hover:bg-slate-600 text-white transition"
              >
                ⬅ Back
              </button>
            )}

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-700 max-w-[480px]">
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${styles.pathBadge}`}
            >
              {sftpMode.toUpperCase()}
            </span>
            <span className="text-yellow-400">📁</span>
            <span className="text-sm text-slate-200 truncate flex-1">
              {currentPath}
            </span>

            <button
              onClick={handleCopyPath}
              className="ml-1 p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition shrink-0"
              title="Copy path"
            >
              📋
            </button>
          </div>
        </div>
      </div>
      {/* TABLE */}
      <div className="overflow-x-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-400" />
          </div>
        )}

        <table className="w-full text-sm text-slate-400">
          <thead className="text-xs uppercase bg-slate-800 border-b-2 border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">Filename</th>
              <th className="px-4 py-3 text-right">Filesize</th>
              <th className="px-4 py-3 text-left">Filetype</th>
              <th className="px-4 py-3 text-right">Last Modified</th>
              <th className="px-4 py-3 text-right">Permissions</th>
              <th className="px-4 py-3 text-right w-24">Actions</th>
            </tr>
          </thead>

          <tbody>
            {files.map((item, index) => {
              const dir = isDirectory(item);

              return (
                <tr
                  key={index}
                  className={`cursor-pointer border-b border-slate-700 hover:bg-slate-700/50 ${
                    dir ? styles.folderIcon : "text-slate-300"
                  }`}
                  onDoubleClick={() => openItem(item, dir)}
                >
                  <td className="px-4 py-2 font-medium">
                    <div className="flex items-center">
                      <Icon
                        name={dir ? "folder" : "file"}
                        className={`w-5 h-5 mr-3 flex-shrink-0 ${
                          dir ? styles.folderIcon : "text-slate-300"
                        }`}
                      />
                      <span
                        className={dir ? styles.folderIcon : "text-slate-100"}
                      >
                        {item.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-2 text-right">
                    {item.size?.toLocaleString() || "-"}
                  </td>

                  <td className="px-4 py-2 text-left">
                    {dir ? "folder" : "file"}
                  </td>

                  <td className="px-4 py-2 text-right">
                    {formatModifyTime(item.modifyTime)}
                  </td>

                  <td className="px-4 py-2 text-right">
                    {item.permissions || "-"}
                  </td>

                  <td className="px-4 py-2 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionFor((prev) =>
                          prev === item.name ? null : item.name
                        );
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M4 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                      </svg>
                    </button>

                    {openActionFor === item.name && (
                      <div
                        className={`absolute right-0 w-32 rounded-lg bg-slate-900 border border-slate-700 shadow-xl z-30 overflow-hidden ${
                          files.length > 3 && index >= files.length - 3
                            ? "bottom-full mb-2"
                            : "top-full mt-2"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full flex items-center px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-700 transition-colors"
                          onClick={() => {
                            handleRename(item.name, dir);
                            setOpenActionFor(null);
                          }}
                        >
                          <span className="flex-1 text-left">Rename</span>
                        </button>

                        <button
                          className="w-full flex items-center px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-700 transition-colors"
                          onClick={() => {
                            openItem(item, dir);
                            setOpenActionFor(null);
                          }}
                        >
                          <span className="flex-1 text-left">Edit</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* MODAL EDIT FILE */}
      {previewFile !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="w-[90vw] max-w-5xl h-[80vh] bg-[#1e1e1e] text-[#d4d4d4] rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col">
            <div className="flex justify-between items-center px-4 py-2 border-b border-slate-700 bg-[#252526]">
              <h3 className="font-semibold text-sm">
                Đang chỉnh sửa:{" "}
                <span className="text-emerald-400">{previewFile}</span>
              </h3>
              <button
                onClick={closePreview}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={getLanguageFromFile(previewFile)}
                defaultLanguage="html"
                value={previewContent ?? ""}
                onChange={(value) => setPreviewContent(value || "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  cursorBlinking: "smooth",
                  smoothScrolling: true,
                }}
              />
            </div>

            <div className="flex justify-end gap-3 px-4 py-3 border-t border-slate-700 bg-[#252526]">
              <button
                onClick={closePreview}
                className="px-3 py-1.5 text-sm rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveFile}
                disabled={isSaving}
                className="px-4 py-1.5 text-sm rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium"
              >
                {isSaving ? "Đang lưu..." : "💾 Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL VIDEO */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className={`bg-slate-900 rounded-xl shadow-2xl border border-slate-700 transition-all duration-300 ${
              isVideoSmall ? "w-[60vw] max-w-3xl" : "w-[90vw] max-w-5xl"
            }`}
          >
            <div className="flex justify-between items-center px-4 py-2 bg-slate-800 rounded-t-xl">
              <span className="text-white font-semibold text-sm">
                🎬 Xem video
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsVideoSmall((prev) => !prev)}
                  className="text-yellow-400 hover:text-yellow-300 text-sm"
                  title="Thu nhỏ / Phóng to"
                >
                  🧩
                </button>

                <button
                  onClick={() => setPreviewVideo(null)}
                  className="text-red-400 hover:text-red-300 text-lg"
                  title="Đóng"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-3">
              <video
                src={previewVideo}
                controls
                autoPlay
                className={`w-full rounded-lg object-contain ${
                  isVideoSmall ? "max-h-[400px]" : "max-h-[700px]"
                }`}
              />
            </div>
          </div>
        </div>
      )}
      {/* MODAL IMAGE PREVIEW */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => closeImagePreview()}
        >
          <div
            className="p-2 bg-slate-900 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-xl"
              alt="preview"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  closeImagePreview();
                }}
                className="px-4 py-1.5 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                Đóng
              </button>
              <a
                href={previewImage}
                download
                className="px-4 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"
              >
                Tải về
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
