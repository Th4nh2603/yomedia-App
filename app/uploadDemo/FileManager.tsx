// "use client";
// import React, { useEffect, useState } from "react";
// import Icon from "../icons/Icons";

// const FileManager: React.FC = () => {
//   const [files, setFiles] = useState<any[]>([]);
//   const [currentPath, setCurrentPath] = useState<string>(".");

//   // 👉 Hàm load file từ API
//   const loadFiles = async (path: string) => {
//     try {
//       const res = await fetch(
//         `/api/sftp/list?path=${encodeURIComponent(path)}`
//       );
//       const data = await res.json();
//       if (data.success) {
//         setFiles(data.files);
//         setCurrentPath(path);
//       } else {
//         alert("Lỗi: " + data.error);
//       }
//     } catch (e: any) {
//       alert("Không thể tải thư mục: " + e.message);
//     }
//   };

//   useEffect(() => {
//     loadFiles(".");
//   }, []);

//   // 📂 Khi click vào folder
//   const handleFolderClick = (name: string) => {
//     const newPath = currentPath === "." ? name : `${currentPath}/${name}`;
//     loadFiles(newPath);
//   };

//   // ⬅ Quay lại thư mục cha
//   const handleGoBack = () => {
//     if (currentPath === ".") return;
//     const parts = currentPath.split("/");
//     parts.pop();
//     const parentPath = parts.join("/") || ".";
//     loadFiles(parentPath);
//   };

//   return (
//     <div className="bg-slate-800 rounded-lg shadow-lg p-6 mt-8">
//       {/* Header hiển thị đường dẫn hiện tại */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-white text-lg font-semibold">
//           📁 Path: <span className="text-yellow-400">{currentPath}</span>
//         </h2>

//         {currentPath !== "." && (
//           <button
//             onClick={handleGoBack}
//             className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded text-white"
//           >
//             ⬅ Back
//           </button>
//         )}
//       </div>

//       {/* Bảng dữ liệu */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm text-slate-400">
//           <thead className="text-xs uppercase bg-slate-800 border-b-2 border-slate-700">
//             <tr>
//               <th className="px-4 py-3 text-left">Filename</th>
//               <th className="px-4 py-3 text-right">Filesize</th>
//               <th className="px-4 py-3 text-left">Filetype</th>
//               <th className="px-4 py-3 text-right">Last Modified</th>
//               <th className="px-4 py-3 text-right">Permissions</th>
//               <th className="px-4 py-3 text-right">Owner/Group</th>
//             </tr>
//           </thead>

//           <tbody>
//             {files.map((item, index) => (
//               <tr
//                 key={index}
//                 className={`cursor-pointer border-b border-slate-700 hover:bg-slate-700/50 ${
//                   item.type === "d" || item.type === "directory"
//                     ? "text-yellow-300"
//                     : "text-slate-300"
//                 }`}
//                 onClick={() =>
//                   (item.type === "d" || item.type === "directory") &&
//                   handleFolderClick(item.name)
//                 }
//               >
//                 <td className="px-4 py-2 font-medium flex items-center">
//                   <Icon
//                     name={item.type}
//                     className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0"
//                   />
//                   {item.name}
//                 </td>

//                 <td className="px-4 py-2 text-right">
//                   {item.size?.toLocaleString() || "-"}
//                 </td>
//                 <td className="px-4 py-2 text-left">{item.type}</td>
//                 <td className="px-4 py-2 text-right">
//                   {item.modifyTime || item.lastModified}
//                 </td>
//                 <td className="px-4 py-2 text-right">{item.permissions}</td>
//                 <td className="px-4 py-2 text-right">
//                   {item.owner} {item.group}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default FileManager;
"use client";
import React, { useEffect, useState } from "react";
import Icon from "../icons/Icons";

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState<string>(".");
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const loadFiles = async (path: string) => {
    try {
      const res = await fetch(
        `/api/sftp/list?path=${encodeURIComponent(path)}`
      );
      const data = await res.json();
      if (data.success) {
        setFiles(data.files);
        setCurrentPath(path);
      } else {
        alert("Lỗi: " + data.error);
      }
    } catch (e: any) {
      alert("Không thể tải thư mục: " + e.message);
    }
  };

  useEffect(() => {
    loadFiles(".");
  }, []);

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

  // 🧩 Khi double-click file → đọc nội dung
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
      <div className="flex items-center justify-between mb-4">
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
              <th className="px-4 py-3 text-right">Owner/Group</th>
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
                    name={item.type}
                    className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0"
                  />
                  {item.name}
                </td>
                <td className="px-4 py-2 text-right">
                  {item.size?.toLocaleString() || "-"}
                </td>
                <td className="px-4 py-2 text-left">{item.type}</td>
                <td className="px-4 py-2 text-right">{item.modifyTime}</td>
                <td className="px-4 py-2 text-right">{item.permissions}</td>
                <td className="px-4 py-2 text-right">
                  {item.owner} {item.group}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🪟 Modal Preview nội dung file */}
      {previewContent && (
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
