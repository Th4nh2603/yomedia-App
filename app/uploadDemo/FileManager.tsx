"use client";
import React, { useEffect, useState } from "react";
import Icon from "../icons/Icons";

const formatModifyTime = (value: number | string | undefined) => {
  if (value === undefined || value === null) return "-";
  let num = typeof value === "string" ? parseInt(value, 10) : value;
  if (isNaN(num)) return "-";
  if (num < 1e12) {
    num = num * 1000;
  }
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

const sortFiles = (items: any[]) => {
  return [...items].sort((a, b) => {
    const aIsDir = a.type === "d" || a.type === "directory";
    const bIsDir = b.type === "d" || b.type === "directory";

    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;

    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
};

// 💡 Thêm props: nhận currentPath từ UploadDemo & báo lại khi đổi path
type FileManagerProps = {
  currentPath: string;
  onPathChange?: (path: string) => void;
  reloadKey?: number; // 👈 thêm
};

const FileManager: React.FC<FileManagerProps> = ({
  currentPath,
  onPathChange,
  reloadKey,
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const loadFiles = async (path: string) => {
    try {
      const res = await fetch(
        `/api/sftp/list?path=${encodeURIComponent(path)}`
      );
      const data = await res.json();
      if (data.success) {
        const sortedFiles = sortFiles(data.files);
        setFiles(sortedFiles);
        onPathChange?.(path); // 🔥 cập nhật path cho UploadDemo
      } else {
        alert("Lỗi: " + data.error);
      }
    } catch (e: any) {
      alert("Không thể tải thư mục: " + e.message);
    }
  };

  // useEffect(() => {
  //   // load lần đầu với path hiện tại (thường là ".")
  //   loadFiles(currentPath || ".");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  useEffect(() => {
    if (reloadKey !== undefined) {
      loadFiles(currentPath);
    }
  }, [reloadKey]);
  const handleFolderClick = (name: string) => {
    const newPath = currentPath === "." ? name : `${currentPath}/${name}`;
    loadFiles(newPath);
  };

  const handleGoBack = () => {
    if (currentPath === ".") return;
    const parts = currentPath.split("/");
    parts.pop();
    const parentPath = parts.join("/") || ".";
    loadFiles(parentPath);
  };
  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(currentPath);
      alert("✅ Đã copy path: " + currentPath);
    } catch (err) {
      console.error("Copy failed:", err);
      alert("❌ Không thể copy path");
    }
  };

  const handleFileDoubleClick = async (name: string) => {
    const filePath = currentPath === "." ? name : `${currentPath}/${name}`;
    try {
      const res = await fetch(
        `/api/sftp/read?path=${encodeURIComponent(filePath)}`
      );
      const data = await res.json();
      if (data.success) {
        setPreviewFile(name);
        setPreviewContent(data.content);
      } else {
        alert("Lỗi: " + data.error);
      }
    } catch (err: any) {
      alert("Không thể đọc file: " + err.message);
    }
  };

  const closePreview = () => {
    setPreviewContent(null);
    setPreviewFile(null);
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 mt-8">
      {/* <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">
          📁 Path: <span className="text-yellow-400">{currentPath}</span>
        </h2>
        {currentPath !== "." && (
          <button
            onClick={handleGoBack}
            className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded text-white"
          >
            ⬅ Back
          </button>
        )}
      </div> */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold flex items-center gap-3">
          📁 Path: <span className="text-yellow-400">{currentPath}</span>
          <button
            onClick={handleCopyPath}
            className="px-2 py-1 text-xs bg-teal-600 hover:bg-teal-700 rounded text-white transition"
            title="Copy path"
          >
            📋 Copy
          </button>
        </h2>

        {currentPath !== "." && (
          <button
            onClick={handleGoBack}
            className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded text-white"
          >
            ⬅ Back
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-400">
          <thead className="text-xs uppercase bg-slate-800 border-b-2 border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">Filename</th>
              <th className="px-4 py-3 text-right">Filesize</th>
              <th className="px-4 py-3 text-left">Filetype</th>
              <th className="px-4 py-3 text-right">Last Modified</th>
              <th className="px-4 py-3 text-right">Permissions</th>
            </tr>
          </thead>

          <tbody>
            {files.map((item, index) => (
              <tr
                key={index}
                className={`cursor-pointer border-b border-slate-700 hover:bg-slate-700/50 ${
                  item.type === "d" || item.type === "directory"
                    ? "text-yellow-300"
                    : "text-slate-300"
                }`}
                onClick={() =>
                  (item.type === "d" || item.type === "directory") &&
                  handleFolderClick(item.name)
                }
                onDoubleClick={() =>
                  item.type !== "d" &&
                  item.type !== "directory" &&
                  handleFileDoubleClick(item.name)
                }
              >
                <td className="px-4 py-2 font-medium flex items-center">
                  <Icon
                    name={
                      item.type === "d" || item.type === "directory"
                        ? "folder"
                        : "file"
                    }
                    className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0"
                  />
                  {item.name}
                </td>

                <td className="px-4 py-2 text-right">
                  {item.size?.toLocaleString() || "-"}
                </td>
                <td className="px-4 py-2 text-left flex items-left">
                  {item.type === "d" ? "folder" : "file"}
                </td>
                <td className="px-4 py-2 text-right">
                  {formatModifyTime(item.modifyTime)}
                </td>
                <td className="px-4 py-2 text-right">{item.permissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewFile !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 text-slate-200 w-3/4 max-h-[80vh] rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 border-b border-slate-700">
              <h3 className="font-semibold">{previewFile}</h3>
              <button
                onClick={closePreview}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>
            <pre className="p-4 overflow-auto text-sm whitespace-pre-wrap">
              {previewContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
