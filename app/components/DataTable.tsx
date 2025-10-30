import React, { useState, useMemo } from "react";
import Icon from "../icons/Icons";
import { MOCK_DATA } from "../../constants";
import { DemoData } from "../../types";

const ITEMS_PER_PAGE = 10;

const DataTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(MOCK_DATA.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return MOCK_DATA.slice(startIndex, endIndex);
  }, [currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, MOCK_DATA.length);

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">DEMO</h1>
          <p className="text-sm text-slate-400">Showing all Demo</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white">
            <Icon name="search" className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white">
            <Icon name="download" className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white">
            <Icon name="print" className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white">
            <Icon name="layoutGrid" className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white">
            <Icon name="filter" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-teal-400 uppercase bg-slate-800 border-b border-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                YEAR
              </th>
              <th scope="col" className="px-6 py-3">
                MONTH
              </th>
              <th scope="col" className="px-6 py-3">
                BRAND
              </th>
              <th scope="col" className="px-6 py-3">
                HOST
              </th>
              <th scope="col" className="px-6 py-3">
                VIEW
              </th>
              <th scope="col" className="px-6 py-3">
                FORMAT
              </th>
              <th scope="col" className="px-6 py-3">
                FLIGHT
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item: DemoData) => (
              <tr
                key={item.id}
                className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50"
              >
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.year}</td>
                <td className="px-6 py-4">{item.month}</td>
                <td className="px-6 py-4">{item.brand}</td>
                <td className="px-6 py-4">{item.host}</td>
                <td className="px-6 py-4">
                  <button className="text-slate-400 hover:text-teal-400">
                    <Icon name="eye" className="w-5 h-5" />
                  </button>
                </td>
                <td className="px-6 py-4">{item.format}</td>
                <td className="px-6 py-4">{item.flight || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-6">
        <span className="text-sm text-slate-400 mb-4 md:mb-0">
          Showing <span className="font-semibold text-white">{startItem}</span>{" "}
          to <span className="font-semibold text-white">{endItem}</span> of{" "}
          <span className="font-semibold text-white">{MOCK_DATA.length}</span>{" "}
          results
        </span>
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm leading-tight text-slate-400 bg-slate-800 border border-slate-700 rounded-l-lg hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="chevronLeft" className="w-4 h-4" />
            <span className="sr-only">Previous</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-2 text-sm leading-tight border ${
                currentPage === page
                  ? "text-white bg-teal-600 border-teal-600"
                  : "text-slate-400 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm leading-tight text-slate-400 bg-slate-800 border border-slate-700 rounded-r-lg hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="chevronRight" className="w-4 h-4" />
            <span className="sr-only">Next</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default DataTable;
