"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { TEMPLATE_COMPONENTS } from "@/app/data/templates";

const PreviewPage: React.FC = () => {
  const searchParams = useSearchParams();

  const tpl = searchParams.get("tpl") || "";
  const view = searchParams.get("view") || "";
  const fmt = searchParams.get("fmt") || "";

  const TemplateComponent = TEMPLATE_COMPONENTS[tpl];

  return (
    <div className="w-screen min-h-screen bg-slate-900 overflow-x-hidden">
      {TemplateComponent ? (
        TemplateComponent
      ) : (
        <div className="text-center text-white pt-20">
          <h2 className="text-xl font-bold mb-2">Template không tồn tại</h2>
          <p className="text-slate-400">tpl: {tpl}</p>
          <p className="text-slate-400">view: {view}</p>
          <p className="text-slate-400">fmt: {fmt}</p>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
