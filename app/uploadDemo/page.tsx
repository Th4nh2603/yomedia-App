"use client";
import React, { useState, useCallback } from "react";
import Icon from "../icons/Icons";
import FileManager from "./FileManager";

const UploadDemo: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // 💡 Đường dẫn SFTP hiện tại
  const [currentPath, setCurrentPath] = useState<string>(".");

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  // const handleUpload = async () => {
  //   if (files.length === 0) {
  //     alert("Please select files to upload.");
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     files.forEach((file) => formData.append("files", file));
  //     formData.append("path", currentPath); // 🔥 upload vào thư mục đang chọn

  //     const res = await fetch("/api/sftp/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await res.json();
  //     if (data.success) {
  //       alert(`Upload thành công ${files.length} file(s) vào '${currentPath}'`);
  //       setFiles([]);
  //     } else {
  //       alert("Upload lỗi: " + data.error);
  //     }
  //   } catch (err: any) {
  //     console.error(err);
  //     alert("Có lỗi khi upload: " + err.message);
  //   }
  // };
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("path", currentPath);

      const res = await fetch("/api/sftp/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("upload response:", data); // 👈 log ra console

      if (data.success) {
        alert(`Upload thành công ${files.length} file(s) vào '${currentPath}'`);
        setFiles([]);
        // ✅ Trigger refresh FileManager
        setReloadKey((prev) => prev + 1);
      } else {
        alert("Upload lỗi: " + data.error);
      }
    } catch (err: any) {
      console.error("Upload fetch error:", err);
      alert("Có lỗi khi upload: " + err.message);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <>
      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-white">Upload Demo File</h1>
          <p className="text-sm text-slate-400 mt-1">
            Attach your demo files here to process them.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Upload vào thư mục:{" "}
            <span className="font-mono text-yellow-300">{currentPath}</span>
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragging
              ? "border-teal-500 bg-slate-700/50"
              : "border-slate-600 hover:border-slate-500"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <Icon
            name="uploadDemo"
            className="w-12 h-12 mx-auto text-slate-500 mb-4"
          />
          <p className="text-slate-400 mb-2">Drag & drop files here</p>
          <p className="text-slate-500 text-xs mb-4">or</p>
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md text-sm transition-colors duration-200"
          >
            Browse files
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            multiple
            onChange={onFileSelect}
          />
          <p className="text-xs text-slate-500 mt-4">Maximum file size: 50MB</p>
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Selected Files:
            </h2>
            <ul className="space-y-3">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="bg-slate-700 p-3 rounded-md flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      name="invoices"
                      className="w-5 h-5 text-slate-400 flex-shrink-0"
                    />
                    <span
                      className="text-sm text-slate-300 truncate"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-slate-400">
                      {formatBytes(file.size)}
                    </span>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-red-500 hover:text-red-400 text-xs font-semibold"
                    >
                      REMOVE
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleUpload}
                className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200"
              >
                <Icon name="uploadDemo" className="w-5 h-5" />
                <span>Upload Files</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Truyền currentPath xuống FileManager */}
      <FileManager
        currentPath={currentPath}
        onPathChange={setCurrentPath}
        reloadKey={reloadKey}
      />
    </>
  );
};

export default UploadDemo;
