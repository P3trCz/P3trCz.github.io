import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { SortField, SortOrder } from '../../utils/sortUtils';

interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentSortField: SortField;
  currentSortOrder: SortOrder;
  onSort: (field: SortField) => void;
  className?: string;
}

export function SortableHeader({ label, field, currentSortField, currentSortOrder, onSort, className = '' }: SortableHeaderProps) {
  const isActive = currentSortField === field;

  return (
    <div 
      className={`flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors select-none ${isActive ? 'text-white' : ''} ${className}`}
      onClick={() => onSort(field)}
    >
      <span>{label}</span>
      {isActive ? (
        currentSortOrder === 'asc' ? <ArrowUp size={14} className="text-[#dc2626]" /> : <ArrowDown size={14} className="text-[#dc2626]" />
      ) : (
        <ArrowUpDown size={14} className="opacity-30 group-hover:opacity-100" />
      )}
    </div>
  );
}
