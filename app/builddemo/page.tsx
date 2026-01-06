"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import Icon from "../icons/Icons";
import {
  AD_VIEW_OPTIONS,
  TEMPLATE_OPTIONS,
  AD_FORMAT_OPTIONS,
} from "../data/data";
import FileManager from "./FileManager";
import ToastProvider from "../components/FlowbiteToast";
import { useSftpMode } from "../contextAPI/contextmode";
type TemplateOption = {
  name: string;
  value: string;
};
type SourceEnv = "Current" | "Demo" | "Media";
const FOLDER_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

const validateFolderName = (name: string): string | null => {
  const clean = name.trim();

  if (!clean) {
    return "Tên folder không được để trống.";
  }

  if (clean === "." || clean === "..") {
    return 'Tên folder không được là "." hoặc "..".';
  }

  if (!FOLDER_NAME_REGEX.test(clean)) {
    return "Tên folder chỉ được chứa chữ, số, dấu gạch dưới (_) và gạch ngang (-).";
  }

  return null; // hợp lệ
};
const BuildDemo: React.FC = () => {
  // ========= STATE CHO FORM BUILD DEMO =========
  const [selectedAdView, setSelectedAdView] = useState<string>("");
  const [selectedAdFormat, setSelectedAdFormat] = useState<string>("");
  const [sourcePath, setSourcePath] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [sourceEnv, setSourceEnv] = useState<SourceEnv>("Current");
  const { mode: sftpMode } = useSftpMode();
  // ========= STATE CHO UPLOAD DEMO =========
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(".");

  // ====================================================
  // Lọc format theo View
  // ====================================================
  const filteredAdFormats = useMemo(() => {
    if (selectedAdView === "Mobile") {
      return AD_FORMAT_OPTIONS.filter((opt: any) => opt.type === "mobile");
    }
    if (selectedAdView === "Display") {
      return AD_FORMAT_OPTIONS.filter((opt: any) => opt.type === "display");
    }
    if (selectedAdView === "Video") {
      return AD_FORMAT_OPTIONS.filter((opt: any) => opt.type === "video");
    }
    return AD_FORMAT_OPTIONS;
  }, [selectedAdView]);

  useEffect(() => {
    if (!selectedAdView) {
      setSelectedAdFormat("");
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("webkitdirectory", "");
      fileInputRef.current.setAttribute("directory", "");
      fileInputRef.current.setAttribute("accept", ".zip,.rar,.7z");
    }
    if (filteredAdFormats.length > 0) {
      const first = filteredAdFormats[0] as any;
      if (first && first.value) {
        setSelectedAdFormat(first.value);
      }
    } else {
      setSelectedAdFormat("");
    }
  }, [selectedAdView, filteredAdFormats]);

  const getBaseDomain = (env: SourceEnv) => {
    if (env === "Current") {
      if (typeof window !== "undefined") {
        return window.location.origin;
      }
      return "";
    }

    switch (env) {
      case "Demo":
        return process.env.NEXT_PUBLIC_DOMAIN_DEMO || "";
      case "Media":
        return process.env.NEXT_PUBLIC_DOMAIN_MEDIA || "";
      default:
        return "";
    }
  };

  const outputSource = useMemo(() => {
    if (
      !selectedAdView ||
      !selectedTemplate ||
      !selectedAdFormat ||
      !sourcePath
    )
      return "";

    const base = getBaseDomain(sourceEnv);

    return `${base}/preview?view=${encodeURIComponent(
      selectedAdView
    )}&tpl=${encodeURIComponent(selectedTemplate)}&fmt=${encodeURIComponent(
      selectedAdFormat
    )}&path=${encodeURIComponent(sourcePath)}`;
  }, [
    selectedAdView,
    selectedTemplate,
    selectedAdFormat,
    sourceEnv,
    sourcePath,
  ]);

  const templateOptions = TEMPLATE_OPTIONS as TemplateOption[];

  const selectedTemplateName = useMemo(() => {
    const found = templateOptions.find((tpl) => tpl.value === selectedTemplate);
    return found ? found.name : "";
  }, [selectedTemplate, templateOptions]);

  // ====================================================
  // HANDLER FORM (giữ lại để log nếu cần)
  // ====================================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      selectedAdView,
      selectedTemplate,
      selectedAdFormat,
      sourcePath,
      outputSource,
    });

    if (!outputSource) {
      alert("Vui lòng chọn đủ thông tin để generate URL 🔗");
      return;
    }
    alert("Form submitted!\n" + outputSource);
  };

  const handleReset = () => {
    setSelectedAdView("");
    setSelectedTemplate("");
    setSelectedAdFormat("");
    setSourceEnv("Demo");
    setSourcePath("");
    alert("Form reset!");
  };

  const handleCopy = async () => {
    if (!outputSource) {
      alert("Chưa có URL để copy 😅");
      return;
    }
    try {
      await navigator.clipboard.writeText(outputSource);
      alert("Copied to clipboard! ✅");
    } catch (err) {
      console.error(err);
      alert("Không copy được vào clipboard 😢");
    }
  };

  const handleOpen = () => {
    if (!outputSource) {
      alert("Chưa có URL để mở 😅");
      return;
    }
    window.open(outputSource, "_blank", "noopener,noreferrer");
  };

  // ====================================================
  // HANDLER CHO UPLOAD DEMO
  // ====================================================
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

  const traverseFileTree = async (item: any, path = ""): Promise<File[]> => {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file: File) => {
          resolve([new File([file], path + file.name, { type: file.type })]);
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries: any[]) => {
          const files: File[] = [];
          for (const entry of entries) {
            const childFiles = await traverseFileTree(
              entry,
              path + item.name + "/"
            );
            files.push(...childFiles);
          }
          resolve(files);
        });
      }
    });
  };

  const onDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    let allFiles: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        const files = await traverseFileTree(item);
        allFiles.push(...files);
      }
    }

    if (allFiles.length > 0) {
      setFiles((prev) => [...prev, ...allFiles]);
    }
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const getSftpModeFromPath = (path: string): "demo" | "media" => {
    return path.startsWith("media") ? "media" : "demo";
  };

  const checkFileExists = async (fileName: string) => {
    try {
      const mode = getSftpModeFromPath(currentPath);

      const res = await fetch(
        `/api/sftp/check?mode=${mode}&path=${encodeURIComponent(
          currentPath
        )}&fileName=${encodeURIComponent(fileName)}`
      );

      const data = await res.json();
      return data.exists === true;
    } catch (err) {
      console.error("Check file exists error:", err);
      return false;
    }
  };
  const checkFolderExists = async (folderName: string) => {
    const res = await fetch(
      `/api/sftp/list?mode=${sftpMode}&path=${encodeURIComponent(currentPath)}`
    );

    const data = await res.json();
    if (!data.success) return false;

    // kiểm tra xem folder có tồn tại không
    return data.files.some(
      (item: any) =>
        (item.type === "d" || item.type === "directory") &&
        item.name === folderName
    );
  };

  const handleCreateFolder = async () => {
    const folderName = window.prompt("Nhập tên folder mới:");
    if (folderName === null) return; // user bấm Cancel

    const cleanName = folderName.trim();

    // 1. Validate tên
    const error = validateFolderName(cleanName);
    if (error) {
      alert("❌ " + error);
      return;
    }

    // 2. Kiểm tra đã tồn tại chưa
    const existed = await checkFolderExists(cleanName);
    if (existed) {
      alert(`❌ Folder "${cleanName}" đã tồn tại trong thư mục này.`);
      return;
    }

    // 3. Tạo folder nếu mọi thứ OK
    try {
      const res = await fetch(`/api/sftp/mkdir?mode=${sftpMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: currentPath,
          folderName: cleanName,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Không thể tạo folder: " + data.error);
        return;
      }

      alert(`✅ Tạo folder "${cleanName}" thành công!`);
      setReloadKey((prev) => prev + 1);
    } catch (err: any) {
      console.error("Create folder error:", err);
      alert("Có lỗi khi tạo folder: " + err.message);
    }
  };

  // const handleCreateFile = async () => {
  //   const fileName = window.prompt("Nhập tên file mới (ví dụ: index.html):");

  //   if (!fileName || !fileName.trim()) return;

  //   const cleanName = fileName.trim();

  //   try {
  //     const mode = getSftpModeFromPath(currentPath);

  //     const res = await fetch(`/api/sftp/write?mode=${mode}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         path: currentPath === "." ? cleanName : `${currentPath}/${cleanName}`,
  //         content: "", // file rỗng
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!data.success) {
  //       alert("Không tạo được file: " + data.error);
  //       return;
  //     }

  //     alert("Tạo file thành công: " + cleanName);
  //     setReloadKey((prev) => prev + 1);
  //   } catch (err: any) {
  //     alert("Có lỗi khi tạo file: " + err.message);
  //   }
  // };
  const handleCreateFile = async () => {
    const fileName = window.prompt("Nhập tên file mới (ví dụ: index.html):");

    if (!fileName || !fileName.trim()) return;

    const cleanName = fileName.trim();

    try {
      // 1. Kiểm tra đã tồn tại chưa
      const existed = await checkFileExists(cleanName);
      console.log("checkFileExists", cleanName, "=>", existed);

      if (existed) {
        alert(`File "${cleanName}" đã tồn tại trong thư mục hiện tại.`);
        // ❌ Không cho ghi đè → return luôn
        return;
        // Nếu chị MUỐN cho ghi đè thì đổi đoạn này thành window.confirm như lần trước
      }

      // 2. Tạo file mới (chắc chắn chưa có)
      const mode = getSftpModeFromPath(currentPath);

      const res = await fetch(`/api/sftp/write?mode=${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path:
            currentPath === "."
              ? cleanName
              : `${currentPath.replace(/\/$/, "")}/${cleanName}`,
          content: "", // file rỗng
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Không tạo được file: " + data.error);
        return;
      }

      alert(`Tạo file thành công: ${cleanName} ✅`);
      setReloadKey((prev) => prev + 1);
    } catch (err: any) {
      console.error("Create file error:", err);
      alert("Có lỗi khi tạo file: " + err.message);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    // 1. Kiểm tra tồn tại
    const results = await Promise.all(
      files.map(async (file) => {
        const exists = await checkFileExists(file.name);
        return { file, exists };
      })
    );

    const filesToUpload = results
      .filter(({ exists }) => !exists)
      .map(({ file }) => file);

    if (filesToUpload.length === 0) {
      alert("Tất cả file đã tồn tại trên server, không có file nào để upload.");
      return;
    }

    const skipped = results
      .filter(({ exists }) => exists)
      .map(({ file }) => file.name);
    if (skipped.length > 0) {
      alert("Các file đã tồn tại và sẽ không upload:\n" + skipped.join("\n"));
    }

    try {
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("path", currentPath);

      const mode = getSftpModeFromPath(currentPath);

      const res = await fetch(`/api/sftp/upload?mode=${mode}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert(`Upload thành công ${filesToUpload.length} file(s)`);
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setReloadKey((prev) => prev + 1); // → FileManager reload lại MEDIA luôn
      } else {
        alert("Upload lỗi: " + data.error);
      }
    } catch (err: any) {
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

  // ====================================================
  // COMPONENT SELECT INPUT
  // ====================================================
  const SelectInput: React.FC<{
    label: string;
    options: any[];
    value: string;
    setValue: (val: string) => void;
    isPlaceholder?: boolean;
    placeholderText?: string;
  }> = ({
    label,
    options,
    value,
    setValue,
    isPlaceholder,
    placeholderText,
  }) => {
    const renderOptions = () => {
      if (
        options.length > 0 &&
        typeof options[0] === "object" &&
        "type" in options[0]
      ) {
        const grouped = options.reduce(
          (acc: Record<string, any[]>, item: any) => {
            const group = String(item.type);
            if (!acc[group]) acc[group] = [];
            acc[group].push(item);
            return acc;
          },
          {} as Record<string, any[]>
        );

        return Object.entries(grouped).map(([group, items]) => {
          const itemsArr = items as any[];
          return (
            <optgroup
              key={group}
              label={group.charAt(0).toUpperCase() + group.slice(1)}
            >
              {itemsArr.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.name}
                </option>
              ))}
            </optgroup>
          );
        });
      }

      return options.map((opt: any) => {
        if (typeof opt === "string") {
          return (
            <option key={opt} value={opt}>
              {opt}
            </option>
          );
        }
        return (
          <option key={opt.value} value={opt.value}>
            {opt.label || opt.name}
          </option>
        );
      });
    };

    return (
      <div>
        <label
          htmlFor={label}
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          {label}
        </label>
        <select
          id={label}
          name={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-4 pr-10 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 0.5rem center",
            backgroundSize: "1.5em 1.5em",
            backgroundRepeat: "no-repeat",
          }}
        >
          {isPlaceholder && (
            <option value="" disabled>
              {placeholderText || "Please select an option ..."}
            </option>
          )}
          {renderOptions()}
        </select>
      </div>
    );
  };

  // ====================================================
  // RENDER
  // ====================================================
  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ad Formats Demo Form</h1>
        <p className="text-sm text-slate-400 mt-1">
          Choose required options to generate an ad format demo link.
        </p>
      </div>

      {/* items-stretch để 2 cột cao ngang nhau */}
      <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
        {/* LEFT: FORM BUILD DEMO */}
        <div className="lg:w-2/3 flex flex-col">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex-1 flex flex-col"
          >
            <div className="space-y-6">
              <SelectInput
                label="Ad View"
                options={AD_VIEW_OPTIONS as any[]}
                value={selectedAdView}
                setValue={setSelectedAdView}
                isPlaceholder
                placeholderText="Please select an option ..."
              />

              <SelectInput
                label="Template"
                options={TEMPLATE_OPTIONS as any[]}
                value={selectedTemplate}
                setValue={setSelectedTemplate}
                isPlaceholder
                placeholderText="None"
              />

              <SelectInput
                label="Ad Format"
                options={filteredAdFormats as any[]}
                value={selectedAdFormat}
                setValue={setSelectedAdFormat}
                isPlaceholder={!selectedAdView}
                placeholderText="None"
              />

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Source
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    className="pl-4 pr-10 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                    value={sourceEnv}
                    onChange={(e) => setSourceEnv(e.target.value as SourceEnv)}
                  >
                    <option value="Current">Current domain</option>
                    <option value="Demo">Demo</option>
                    <option value="Media">Media</option>
                  </select>

                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Icon name="link" className="w-5 h-5 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      placeholder="source here ..."
                      value={sourcePath}
                      onChange={(e) => setSourcePath(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Output */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  {/* Nút label bên trái */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full 
                 border border-slate-500/70 bg-slate-800/80 
                 px-4 py-1.5 text-xs font-semibold text-slate-100
                 hover:border-teal-400 hover:bg-slate-700 hover:text-white
                 hover:-translate-y-[1px] active:translate-y-0
                 transition-all duration-150 shadow-sm shadow-black/40"
                  >
                    <Icon name="externalLink" className="w-4 h-4" />
                    <span>OUTPUT SOURCE</span>
                  </button>

                  {/* Nhóm action bên phải */}
                  <div className="flex flex-wrap gap-2 justify-end">
                    {/* RESET */}
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 rounded-full 
                   border border-slate-500/70 bg-slate-800/80 
                   px-4 py-1.5 text-xs font-semibold text-slate-100
                   hover:border-amber-400 hover:bg-slate-700 hover:text-white
                   hover:-translate-y-[1px] active:translate-y-0
                   transition-all duration-150 shadow-sm shadow-black/40"
                    >
                      <Icon name="reset" className="w-3.5 h-3.5" />
                      <span>RESET</span>
                    </button>

                    {/* COPY */}
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 rounded-full 
                   border border-slate-500/70 bg-slate-800/80 
                   px-4 py-1.5 text-xs font-semibold text-slate-100
                   hover:border-teal-400 hover:bg-slate-700 hover:text-white
                   hover:-translate-y-[1px] active:translate-y-0
                   transition-all duration-150 shadow-sm shadow-black/40"
                    >
                      <Icon name="copy" className="w-3.5 h-3.5" />
                      <span>COPY</span>
                    </button>

                    {/* OPEN IN NEW TAB */}
                    <button
                      type="button"
                      onClick={handleOpen}
                      className="inline-flex items-center gap-1.5 rounded-full 
                   bg-gradient-to-r from-blue-500 to-cyan-500 
                   px-4 py-1.5 text-xs font-semibold text-white
                   shadow-md shadow-blue-500/40
                   hover:from-blue-400 hover:to-cyan-400
                   hover:-translate-y-[1px] active:translate-y-0
                   transition-all duration-150"
                    >
                      <Icon name="externalLink" className="w-3.5 h-3.5" />
                      <span>OPEN IN NEW TAB</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  disabled
                  value={outputSource}
                  className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-md text-sm text-slate-400 resize-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* ❌ bỏ hẳn nút SUBMIT ở dưới nên không render block nút nữa */}
          </form>
        </div>

        {/* RIGHT: UPLOAD FILE – cao ngang form bên trái */}
        <div className="lg:w-1/3 flex flex-col">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Upload Demo File
          </label>

          {/* flex-1 + h-full để panel này cao bằng cột trái */}
          <div className="w-full bg-slate-700 rounded-md p-4 flex-1 flex flex-col">
            <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
              <span>
                Upload vào thư mục:{" "}
                <span className="font-mono text-yellow-300">{currentPath}</span>
              </span>
              <div className="flex items-center gap-2">
                {" "}
                <button
                  onClick={handleCreateFolder}
                  className="ml-2 inline-flex items-center px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-600 text-slate-200 border border-slate-600"
                >
                  <Icon name="folder" className="w-3 h-3 mr-1" />
                  New Folder
                </button>
                <button
                  onClick={handleCreateFile}
                  className="ml-2 inline-flex items-center px-2 py-1 text-[11px] rounded 
           bg-slate-800 hover:bg-slate-600 text-slate-200 
           border border-slate-600"
                >
                  <Icon name="file" className="w-3 h-3 mr-1" />
                  New File
                </button>
              </div>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 flex-1 flex flex-col items-center justify-center ${
                isDragging
                  ? "border-teal-500 bg-slate-700/70"
                  : "border-slate-600 hover:border-slate-500"
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <Icon
                name="uploadDemo"
                className="w-10 h-10 mx-auto text-slate-500 mb-3"
              />
              <p className="text-slate-400 mb-1">Drag & drop files here</p>
              <p className="text-slate-500 text-xs mb-3">or</p>
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-slate-800 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md text-xs transition-colors duration-200"
              >
                Browse files
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                className="sr-only"
                onChange={onFileSelect}
                ref={fileInputRef}
              />

              <p className="text-[11px] text-slate-500 mt-3">
                Maximum file size: 50MB
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs font-semibold text-slate-200 mb-2">
                  Selected Files:
                </h2>
                <ul className="space-y-2 max-h-40 overflow-auto pr-1">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="bg-slate-800 p-2 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon
                          name="invoices"
                          className="w-4 h-4 text-slate-400 flex-shrink-0"
                        />
                        <span
                          className="text-xs text-slate-300 truncate max-w-[140px]"
                          title={file.name}
                        >
                          {file.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400">
                          {formatBytes(file.size)}
                        </span>
                        <button
                          onClick={() => removeFile(file.name)}
                          className="text-[10px] text-red-500 hover:text-red-400 font-semibold"
                        >
                          REMOVE
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleUpload}
                    className="flex items-center justify-center space-x-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 px-4 rounded-md text-xs transition-colors duration-200"
                  >
                    <Icon name="uploadDemo" className="w-4 h-4" />
                    <span>Upload Files</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {selectedTemplateName && (
            <p className="mt-2 text-[11px] text-slate-500">
              Selected template:{" "}
              <span className="text-slate-300">{selectedTemplateName}</span>
            </p>
          )}
        </div>
      </div>

      {/* FILE MANAGER DƯỚI CÙNG */}
      <ToastProvider>
        <div className="mt-8">
          <FileManager
            currentPath={currentPath}
            onPathChange={setCurrentPath}
            reloadKey={reloadKey}
          />
        </div>
      </ToastProvider>
    </div>
  );
};

export default BuildDemo;
