// Rozbalovací dropdown pro filtrování katalogu – podporuje simple (zahrnutí) i advanced (zahrnutí/vyloučení) režim.
import { useState, useRef } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';

export type AdvancedFilterState = {
  included: string[];
  excluded: string[];
};

type Props = {
  label: string;
  options: string[];
  // Basic filtr
  selected?: string[];
  onChange?: (selected: string[]) => void;
  // Advanced filtr pro žánry
  advancedState?: AdvancedFilterState;
  onAdvancedChange?: (state: AdvancedFilterState) => void;
};

export function FilterDropdown({ label, options, selected, onChange, advancedState, onAdvancedChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(popoverRef, () => setIsOpen(false), isOpen);

  const isAdvanced = !!advancedState && !!onAdvancedChange;

  const toggleOptionSimple = (option: string) => {
    if (!selected || !onChange) return;
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const toggleOptionAdvanced = (option: string) => {
    if (!advancedState || !onAdvancedChange) return;
    const isIncluded = advancedState.included.includes(option);
    const isExcluded = advancedState.excluded.includes(option);

    if (!isIncluded && !isExcluded) {
      onAdvancedChange({ included: [...advancedState.included, option], excluded: advancedState.excluded });
    } else if (isIncluded) {
      onAdvancedChange({ included: advancedState.included.filter(i => i !== option), excluded: [...advancedState.excluded, option] });
    } else {
      onAdvancedChange({ included: advancedState.included, excluded: advancedState.excluded.filter(e => e !== option) });
    }
  };

  const toggleOption = isAdvanced ? toggleOptionAdvanced : toggleOptionSimple;

  const hasSelection = isAdvanced
    ? (advancedState!.included.length > 0 || advancedState!.excluded.length > 0)
    : (selected && selected.length > 0);

  const totalSelected = isAdvanced
    ? (advancedState!.included.length + advancedState!.excluded.length)
    : (selected?.length || 0);

  const displayLabel = hasSelection ? `${label} (${totalSelected})` : label;

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
              if (isAdvanced) {
                const isIncluded = advancedState!.included.includes(option);
                const isExcluded = advancedState!.excluded.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleOption(option)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-[#27272a] transition-colors"
                  >
                    <span className={isIncluded ? 'text-green-500 font-medium' : isExcluded ? 'text-[#dc2626] font-medium' : 'text-gray-300'}>{option}</span>
                    {isIncluded && <Check size={16} className="text-green-500" />}
                    {isExcluded && <X size={16} className="text-[#dc2626]" />}
                  </button>
                );
              } else {
                const isSelected = selected && selected.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleOption(option)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-[#27272a] transition-colors"
                  >
                    <span className={isSelected ? 'text-green-500 font-medium' : 'text-gray-300'}>{option}</span>
                    {isSelected && <Check size={16} className="text-green-500" />}
                  </button>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}
