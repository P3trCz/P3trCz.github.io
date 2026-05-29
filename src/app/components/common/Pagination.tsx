import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  options?: number[];
};

export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
  options = [25, 50, 100]
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const [inputPage, setInputPage] = useState(currentPage.toString());

  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newPage = parseInt(inputPage, 10);
    if (isNaN(newPage) || newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    onPageChange(newPage);
    setInputPage(newPage.toString());
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-4 sm:px-6 bg-[#0a0a0f] border border-[#27272a] rounded-xl shadow-sm mt-4 text-sm text-gray-400">
      <div className="flex items-center gap-3">
        <label htmlFor="items-per-page" className="whitespace-nowrap">Položky na stránku:</label>
        <select
          id="items-per-page"
          value={itemsPerPage}
          onChange={(e) => {
            onItemsPerPageChange(Number(e.target.value));
            onPageChange(1); // Reset to page 1 on size change
          }}
          className="bg-[#1c1c24] border border-[#27272a] text-white px-2 py-1 rounded focus:outline-none focus:border-[#dc2626] transition-colors"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
        <div className="whitespace-nowrap">
          {startItem}-{endItem} z {totalItems}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-[#27272a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="První stránka"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-[#27272a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Předchozí stránka"
          >
            <ChevronLeft size={18} />
          </button>

          <form onSubmit={handlePageSubmit} className="flex items-center mx-1">
            <input
              type="text"
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              onBlur={handlePageSubmit}
              className="w-10 text-center bg-[#1c1c24] border border-[#27272a] text-white px-1 py-1 rounded focus:outline-none focus:border-[#dc2626] transition-colors"
              title="Přejít na stránku"
            />
            <span className="mx-2">z {totalPages}</span>
          </form>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-[#27272a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Další stránka"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-[#27272a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Poslední stránka"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
