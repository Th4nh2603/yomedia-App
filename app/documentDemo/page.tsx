"use client";

import React, { useState, useEffect } from "react";
import Icon from "../icons/Icons";
import { marked } from "marked"; // 👈 import thẳng từ package

const DocumentPage: React.FC = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDoc = async () => {
      try {
        const response = await fetch("/docs.md"); // docs.md phải nằm trong /public
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const text = await response.text();
        const html = await marked.parse(text); // 👈 await nên giờ kiểu chỉ còn string
        setContent(html);
      } catch (err) {
        console.error("Error fetching or parsing markdown:", err);
        setError("Could not load documentation. Please try again later.");
      }
    };

    loadDoc();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-2">
      {/* Header section */}
      <div className="relative bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50 p-8 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Project Documentation
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Your comprehensive guide to the Adminis system.
            </p>
          </div>
          <div className="relative mt-6 md:mt-0 w-full md:w-auto group">
            <Icon
              name="search"
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors w-5 h-5"
            />
            <input
              type="text"
              placeholder="Search docs..."
              className="w-full md:w-80 pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-inner"
              aria-label="Search documentation"
            />
          </div>
        </div>
      </div>

      {/* Main content layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sticky Table of Contents / Sidebar */}
        <aside className="lg:w-64 lg:flex-shrink-0 sticky top-6">
          <div className="bg-slate-800/40 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 shadow-lg">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              On this page
            </h2>
            <nav aria-label="Documentation sections" className="relative">
              {/* Visual timeline line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-700/50"></div>

              <ul className="space-y-4 text-sm relative">
                <li className="group">
                  <div className="absolute left-[2px] mt-1.5 w-3 h-3 rounded-full border-2 border-teal-500 bg-slate-900 z-10 group-hover:bg-teal-500 transition-colors"></div>
                  <a
                    href="#1-introduction"
                    className="block pl-6 text-slate-300 hover:text-white font-medium transition-colors"
                  >
                    Introduction
                  </a>
                </li>
                <li className="group">
                  <div className="absolute left-[5px] mt-2 w-1.5 h-1.5 rounded-full bg-slate-600 z-10 group-hover:bg-teal-400 transition-colors"></div>
                  <a
                    href="#2-setup-demo"
                    className="block pl-6 text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    Setup Demo
                  </a>
                  <ul className="pl-10 mt-2 space-y-2 text-xs border-l border-slate-700/0">
                    <li>
                      <a
                        href="#21-asset-preparation"
                        className="block text-slate-500 hover:text-teal-300 transition-colors"
                      >
                        Asset Preparation
                      </a>
                    </li>
                    <li>
                      <a
                        href="#22-uploading-assets"
                        className="block text-slate-500 hover:text-teal-300 transition-colors"
                      >
                        Uploading Assets
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="group">
                  <div className="absolute left-[5px] mt-2 w-1.5 h-1.5 rounded-full bg-slate-600 z-10 group-hover:bg-teal-400 transition-colors"></div>
                  <a
                    href="#3-build-demo"
                    className="block pl-6 text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    Build Demo
                  </a>
                  <ul className="pl-10 mt-2 space-y-2 text-xs">
                    <li>
                      <a
                        href="#31-configuration-steps"
                        className="block text-slate-500 hover:text-teal-300 transition-colors"
                      >
                        Configuration
                      </a>
                    </li>
                    <li>
                      <a
                        href="#32-generating-the-link"
                        className="block text-slate-500 hover:text-teal-300 transition-colors"
                      >
                        Generating Link
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="group">
                  <div className="absolute left-[5px] mt-2 w-1.5 h-1.5 rounded-full bg-slate-600 z-10 group-hover:bg-teal-400 transition-colors"></div>
                  <a
                    href="#4-design-demo"
                    className="block pl-6 text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    Design Demo
                  </a>
                  <ul className="pl-10 mt-2 space-y-2 text-xs">
                    <li>
                      <a
                        href="#41-template-preview"
                        className="block text-slate-500 hover:text-teal-300 transition-colors"
                      >
                        Template Preview
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="group">
                  <div className="absolute left-[5px] mt-2 w-1.5 h-1.5 rounded-full bg-slate-600 z-10 group-hover:bg-teal-400 transition-colors"></div>
                  <a
                    href="#5-faq"
                    className="block pl-6 text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Quick Link Box */}
          <div className="mt-6 p-4 bg-gradient-to-br from-teal-900/40 to-slate-900/40 border border-teal-500/20 rounded-xl">
            <p className="text-xs text-teal-200 mb-2 font-semibold">
              Need help?
            </p>
            <p className="text-xs text-slate-400 mb-3">
              Contact support for specific asset requirements.
            </p>
            <button className="text-xs bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 px-3 py-1.5 rounded-lg transition-colors border border-teal-500/20 w-full text-center">
              Contact Support
            </button>
          </div>
        </aside>

        {/* Article Content */}
        <article className="flex-1 bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 md:p-12 min-h-[500px]">
          <div
            className="prose-custom max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                content ||
                '<div class="flex items-center justify-center h-64"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div></div>',
            }}
          />
        </article>
      </div>
    </div>
  );
};

export default DocumentPage;
