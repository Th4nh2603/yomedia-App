"use client";

import React, { useEffect, useMemo, useState } from "react";
import Icon from "../icons/Icons";
import {
  AD_VIEW_OPTIONS,
  TEMPLATE_OPTIONS,
  AD_FORMAT_OPTIONS,
} from "../data/data";
import { TEMPLATE_COMPONENTS } from "../data/templates";

type TemplateOption = {
  name: string;
  value: string;
};
type SourceEnv = "Current" | "Demo" | "Media";

const BuildDemo: React.FC = () => {
  const [selectedAdView, setSelectedAdView] = useState<string>("");
  const [selectedAdFormat, setSelectedAdFormat] = useState<string>("");
  const [sourcePath, setSourcePath] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [sourceEnv, setSourceEnv] = useState<SourceEnv>("Current");

  // Lọc format theo View
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

  // 🔥 Khi đổi Ad View → tự động chọn format đầu tiên (nếu có), nếu không thì clear
  useEffect(() => {
    if (!selectedAdView) {
      setSelectedAdFormat("");
      return;
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

  // ✅ generate URL – chỉ cần check rỗng
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

  // const outputSource = useMemo(() => {
  //   if (
  //     !selectedAdView ||
  //     !selectedTemplate ||
  //     !selectedAdFormat ||
  //     !sourcePath
  //   )
  //     return "";

  //   const base =
  //     sourceEnv === "Demo"
  //       ? "https://demo.example.com"
  //       : sourceEnv === "Stage"
  //       ? "https://stage.example.com"
  //       : "https://prod.example.com";

  //   return `${base}/${sourcePath}?view=${encodeURIComponent(
  //     selectedAdView
  //   )}&tpl=${encodeURIComponent(selectedTemplate)}&fmt=${encodeURIComponent(
  //     selectedAdFormat
  //   )}`;
  // }, [
  //   selectedAdView,
  //   selectedTemplate,
  //   selectedAdFormat,
  //   sourceEnv,
  //   sourcePath,
  // ]);

  const templateOptions = TEMPLATE_OPTIONS as TemplateOption[];

  const selectedTemplateName = useMemo(() => {
    const found = templateOptions.find((tpl) => tpl.value === selectedTemplate);
    return found ? found.name : "";
  }, [selectedTemplate, templateOptions]);

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

  // ---------------- SelectInput ----------------
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

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ad Formats Demo Form</h1>
        <p className="text-sm text-slate-400 mt-1">
          Choose required options to generate an ad format demo link.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              // vẫn cho placeholder khi chưa chọn view
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
              <div className="flex justify-between items-center mb-2">
                <button
                  type="button"
                  className="flex items-center space-x-2 border border-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md text-sm hover:bg-slate-700"
                >
                  <Icon name="externalLink" className="w-4 h-4" />
                  <span>OUTPUT SOURCE</span>
                </button>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-md text-sm"
                  >
                    <Icon name="copy" className="w-4 h-4" />
                    <span>COPY</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpen}
                    className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-md text-sm"
                  >
                    <Icon name="externalLink" className="w-4 h-4" />
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

            <div className="flex justify-end items-center pt-6 border-t border-slate-700/60 mt-4">
              <div className="flex gap-3">
                {/* Reset */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-500/70 
                 bg-slate-800/70 px-5 py-2.5 text-sm font-semibold text-slate-200
                 hover:bg-slate-700 hover:border-slate-300 hover:text-white
                 hover:translate-y-[1px] active:translate-y-[2px]
                 transition-all duration-150 shadow-sm shadow-black/40"
                >
                  <Icon name="reset" className="w-4 h-4" />
                  <span>RESET</span>
                </button>

                {/* Submit */}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full 
                 bg-gradient-to-r from-blue-500 to-cyan-500 
                 px-6 py-2.5 text-sm font-semibold text-white
                 shadow-lg shadow-blue-500/30
                 hover:from-blue-400 hover:to-cyan-400
                 hover:translate-y-[1px] active:translate-y-[2px]
                 active:shadow-md transition-all duration-150"
                >
                  <Icon name="paperPlane" className="w-4 h-4" />
                  <span>SUBMIT</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:w-1/3">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Template Preview
          </label>

          <div className="w-full h-64 bg-slate-700 rounded-md p-3 overflow-auto">
            {selectedTemplate ? (
              TEMPLATE_COMPONENTS[selectedTemplate] || (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Icon name="image" className="w-16 h-16 mb-4" />
                  <p className="font-semibold">Template chưa được định nghĩa</p>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Icon name="image" className="w-16 h-16 mb-2" />
                <p className="font-semibold">No Preview Available</p>
                {selectedTemplateName && (
                  <p className="text-xs mt-1 text-slate-500">
                    Selected: {selectedTemplateName}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildDemo;
