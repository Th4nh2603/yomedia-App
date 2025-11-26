"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { TEMPLATE_COMPONENTS } from "../data/templates"; // chỉnh lại path cho đúng

const NotFoundTemplate: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
    <div className="text-center">
      <p className="text-lg font-semibold mb-2">Template không tồn tại</p>
      <p className="text-sm text-slate-400">
        Vui lòng kiểm tra lại tham số <code>tpl</code> trên URL.
      </p>
    </div>
  </div>
);

const AdPreviewPage: React.FC = () => {
  const searchParams = useSearchParams();

  const tpl = searchParams.get("tpl") || ""; // ví dụ: phunutoday
  const view = searchParams.get("view") || ""; // Display, Mobile...
  const fmt = searchParams.get("fmt") || ""; // big-balloon-pc...

  // nếu cần dùng view / fmt sau này thì pass vào bằng context/props

  const content = TEMPLATE_COMPONENTS[tpl];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      {content ? content : <NotFoundTemplate />}
    </div>
  );
};

export default AdPreviewPage;
