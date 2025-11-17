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
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Project Documentation
            </h1>
            <p className="text-slate-400 mt-2">
              Your one-stop guide to understanding the application.
            </p>
          </div>
          <div className="relative mt-4 md:mt-0 w-full md:w-auto">
            <Icon
              name="search"
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-slate-500 w-5 h-5"
            />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full md:w-72 pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              aria-label="Search documentation"
            />
          </div>
        </div>
      </div>

      {/* Main content layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Table of Contents / Sidebar */}
        <aside className="lg:w-1/4 lg:flex-shrink-0">
          <div className="sticky top-8 bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">
              Table of Contents
            </h2>
            <nav aria-label="Documentation sections">
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#introduction"
                    className="block text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    1. Introduction
                  </a>
                </li>
                <li>
                  <a
                    href="#getting-started"
                    className="block text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    2. Getting Started
                  </a>
                  <ul className="pl-4 mt-2 space-y-2 border-l border-slate-700">
                    <li>
                      <a
                        href="#installation"
                        className="block text-slate-400 hover:text-teal-400 transition-colors"
                      >
                        2.1 Installation
                      </a>
                    </li>
                    <li>
                      <a
                        href="#configuration"
                        className="block text-slate-400 hover:text-teal-400 transition-colors"
                      >
                        2.2 Configuration
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#api-reference"
                    className="block text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    3. API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#components"
                    className="block text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    4. Components
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="block text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    5. FAQ
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Article Content */}
        <article className="lg:w-3/4 bg-slate-800 rounded-lg shadow-lg p-8 text-slate-300 min-h-[300px]">
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{
              __html: error
                ? `<p class="text-red-400">${error}</p>`
                : content || "<p>Loading documentation...</p>",
            }}
          />
        </article>
      </div>
    </div>
  );
};

export default DocumentPage;
