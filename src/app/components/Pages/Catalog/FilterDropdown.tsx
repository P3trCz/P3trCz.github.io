import React, { useState, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';

type Props = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export function FilterDropdown({ label, options, selected, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(popoverRef, () => setIsOpen(false), isOpen);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const hasSelection = selected.length > 0;
  const displayLabel = hasSelection ? `${label} (${selected.length})` : label;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors border text-sm ${hasSelection || isOpen
          ? 'bg-[#1c1c24] border-[#dc2626] text-white'
          : 'bg-[#111116] border-[#27272a] text-gray-400 hover:text-white hover:border-[#3f3f46]'
          }`}
      >
        {displayLabel}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-[#1c1c24] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-50 py-2">
          <div className="max-h-64 overflow-y-auto">
            {options.map(option => {
              const isSelected = selected.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-[#27272a] transition-colors"
                >
                  <span className={isSelected ? 'text-[#dc2626] font-medium' : 'text-gray-300'}>{option}</span>
                  {isSelected && <Check size={16} className="text-[#dc2626]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
