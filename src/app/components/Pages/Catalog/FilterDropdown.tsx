// Rozbalovací dropdown pro filtrování katalogu – podporuje simple (zahrnutí) i advanced (zahrnutí/vyloučení) režim.
import { useState, useRef } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#1c1c24] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-50 py-2 flex flex-col max-h-96">

          {options.length > 8 && (
            <div className="px-3 pb-2 border-b border-[#27272a] shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Hledat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111116] border border-[#27272a] rounded-lg pl-8 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#dc2626] transition-colors"
                />
              </div>
            </div>
          )}

          <div className="overflow-y-auto flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">Nic nenalezeno</div>
            ) : (
              filteredOptions.map(option => {
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
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
