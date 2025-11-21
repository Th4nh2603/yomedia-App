"use client";
import React, { useCallback, useMemo, useState } from "react";
import Icon from "../icons/Icons";
import {
  AD_VIEW_OPTIONS,
  TEMPLATE_OPTIONS,
  AD_FORMAT_OPTIONS,
  LOGO_OPTIONS,
} from "../data/data";

/**
 * Giả định các options đều là string[].
 * Ví dụ:
 * AD_VIEW_OPTIONS = ["firstview", "midroll", "instream"]
 * TEMPLATE_OPTIONS = ["classic", "modern", ...]
 * AD_FORMAT_OPTIONS = ["video", "display", "native", ...]
 * LOGO_OPTIONS = ["none", "brandA", "brandB", ...]
 */

type HostEnv = "Demo" | "Stage" | "Prod";

const HOST_BASE: Record<HostEnv, string> = {
  Demo: "https://demo.example.com",
  Stage: "https://stage.example.com",
  Prod: "https://www.example.com",
};

const BuildDemo: React.FC = () => {
  // ---- Form state (controlled) ----
  const [adView, setAdView] = useState<string>("");
  const [template, setTemplate] = useState<string>("None");
  const [adFormat, setAdFormat] = useState<string>("None");
  const [logo, setLogo] = useState<string>("None");
  const [hostEnv, setHostEnv] = useState<HostEnv>("Demo");
  const [source, setSource] = useState<string>("");

  // ---- Derived: có đủ dữ liệu để build link? ----
  const isValid = useMemo(() => {
    if (!adView) return false; // bắt buộc chọn Ad View
    // template/adFormat/logo có thể là "None" tùy logic của em
    return true;
  }, [adView]);

  // ---- Build URL output (đổi theo spec của em nếu cần) ----
  const outputUrl = useMemo(() => {
    if (!isValid) return "";
    const base = HOST_BASE[hostEnv];

    // Ví dụ cấu trúc link:
    // https://{base}/{adView}/{template}/{adFormat}?logo={logo}&src={source}
    const pathParts = [
      adView,
      template !== "None" ? template : undefined,
      adFormat !== "None" ? adFormat : undefined,
    ].filter(Boolean);

    const url = new URL(pathParts.join("/"), base);
    if (logo !== "None") url.searchParams.set("logo", logo);
    if (source.trim()) url.searchParams.set("src", source.trim());
    return url.toString();
  }, [isValid, hostEnv, adView, template, adFormat, logo, source]);

  // ---- Handlers ----
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid) {
        alert("Vui lòng chọn Ad View!");
        return;
      }
      alert("Form submitted!");
    },
    [isValid]
  );

  const handleReset = useCallback(() => {
    setAdView("");
    setTemplate("None");
    setAdFormat("None");
    setLogo("None");
    setHostEnv("Demo");
    setSource("");
  }, []);

  const handleCopy = useCallback(async () => {
    if (!outputUrl) {
      alert("Chưa có URL để copy.");
      return;
    }
    try {
      await navigator.clipboard.writeText(outputUrl);
      alert("Đã copy URL vào clipboard!");
    } catch {
      alert("Copy thất bại. Có thể trình duyệt chặn clipboard.");
    }
  }, [outputUrl]);

  const handleOpen = useCallback(() => {
    if (!outputUrl) {
      alert("Chưa có URL để mở.");
      return;
    }
    window.open(outputUrl, "_blank", "noopener,noreferrer");
  }, [outputUrl]);

  // ---- Reusable SelectInput ----
  const SelectInput: React.FC<{
    label: string;
    options: (string | { label: string; value: string })[];
    defaultValue: string;
    isPlaceholder?: boolean;
  }> = ({ label, options, defaultValue, isPlaceholder }) => (
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
        defaultValue={isPlaceholder ? "" : defaultValue}
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
            {defaultValue}
          </option>
        )}
        {!isPlaceholder && <option value={defaultValue}>{defaultValue}</option>}
        {options.map((opt) => {
          if (typeof opt === "string") {
            return (
              <option key={opt} value={opt}>
                {opt}
              </option>
            );
          }
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ad Formats Demo Form</h1>
        <p className="text-sm text-slate-400 mt-1">
          Chọn các tùy chọn để tạo link demo. Ad View là bắt buộc.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* FORM */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <SelectInput
              label="Ad View"
              options={AD_VIEW_OPTIONS}
              defaultValue="Please select an option ..."
              isPlaceholder
            />
            <SelectInput
              label="Template"
              options={TEMPLATE_OPTIONS}
              defaultValue="None"
            />
            <SelectInput
              label="Ad Format"
              options={AD_FORMAT_OPTIONS}
              defaultValue="None"
            />
            <SelectInput
              label="Logo"
              options={LOGO_OPTIONS}
              defaultValue="None"
            />

            {/* SOURCE + ENV */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Source
              </label>
              <div className="flex items-center gap-2">
                <select
                  className="pl-4 pr-10 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundSize: "1.5em 1.5em",
                    backgroundRepeat: "no-repeat",
                  }}
                  value={hostEnv}
                  onChange={(e) => setHostEnv(e.target.value as HostEnv)}
                >
                  <option>Demo</option>
                  <option>Stage</option>
                  <option>Prod</option>
                </select>

                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon name="link" className="w-5 h-5 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="source here ..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* OUTPUT */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <button
                  type="button"
                  onClick={() => {
                    if (outputUrl) {
                      navigator.clipboard
                        .writeText(outputUrl)
                        .then(() => alert("Đã copy URL!"))
                        .catch(() => alert("Copy thất bại."));
                    }
                  }}
                  className="flex items-center space-x-2 border border-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md text-sm hover:bg-slate-700"
                >
                  <Icon name="externalLink" className="w-4 h-4" />
                  <span>OUTPUT SOURCE</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-md text-sm"
                    disabled={!outputUrl}
                    aria-disabled={!outputUrl}
                  >
                    <Icon name="copy" className="w-4 h-4" />
                    <span>COPY</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpen}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-md text-sm"
                    disabled={!outputUrl}
                    aria-disabled={!outputUrl}
                  >
                    <Icon name="externalLink" className="w-4 h-4" />
                    <span>OPEN IN NEW TAB</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                readOnly
                value={outputUrl}
                className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-md text-sm text-slate-300 resize-none"
                placeholder="URL sẽ hiển thị ở đây sau khi chọn đủ Ad View."
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-md transition-colors duration-200 ${
                    isValid
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600/40 text-white/70 cursor-not-allowed"
                  }`}
                >
                  <Icon name="paperPlane" className="w-5 h-5" />
                  <span>SUBMIT</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                >
                  <Icon name="reset" className="w-5 h-5" />
                  <span>RESET</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => alert("Conversion action! (tùy em định nghĩa)")}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              >
                CONVERSION
              </button>
            </div>
          </form>
        </div>

        {/* PREVIEW */}
        <div className="lg:w-1/3">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Template Preview
          </label>

          {outputUrl ? (
            <div className="w-full h-64 bg-slate-900 rounded-md overflow-hidden border border-slate-700">
              <iframe
                src={outputUrl}
                title="Ad Preview"
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-slate-700 rounded-md flex flex-col items-center justify-center text-slate-500">
              <Icon name="image" className="w-16 h-16 mb-4" />
              <p className="font-semibold">No Preview Available</p>
              <p className="text-xs mt-1">Chọn Ad View để hiển thị preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildDemo;
