import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';

export type YearRangeState = {
  min: number | null;
  max: number | null;
};

type Props = {
  label: string;
  selected: YearRangeState;
  onChange: (state: YearRangeState) => void;
};

type FormProps = {
  selected: YearRangeState;
  onChange: (state: YearRangeState) => void;
  onClose: () => void;
};

function YearRangeForm({ selected, onChange, onClose }: FormProps) {
  const [minVal, setMinVal] = useState<string>(selected.min !== null ? selected.min.toString() : '');
  const [maxVal, setMaxVal] = useState<string>(selected.max !== null ? selected.max.toString() : '');

  const minNum = minVal ? parseInt(minVal, 10) : null;
  const maxNum = maxVal ? parseInt(maxVal, 10) : null;

  const isInvalid = minNum !== null && maxNum !== null && minNum > maxNum;

  const handleApply = () => {
    if (isInvalid) return;
    onChange({ min: minNum, max: maxNum });
    onClose();
  };

  const handleClear = () => {
    onChange({ min: null, max: null });
    onClose();
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.startsWith('-')) {
      setMinVal('0');
    } else {
      setMinVal(e.target.value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.startsWith('-')) {
      setMaxVal('0');
    } else {
      setMaxVal(e.target.value);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-400 mb-1">Od roku</label>
          <input
            type="number"
            min="0"
            value={minVal}
            onChange={handleMinChange}
            placeholder="Např. 1990"
            className="w-full bg-[#111116] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#dc2626] transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-400 mb-1">Do roku</label>
          <input
            type="number"
            min="0"
            value={maxVal}
            onChange={handleMaxChange}
            placeholder="Např. 2024"
            className="w-full bg-[#111116] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#dc2626] transition-colors"
          />
        </div>
      </div>

      {isInvalid && (
        <div className="text-xs text-[#dc2626]">
          Počáteční rok nemůže být větší než koncový.
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleClear}
          className="w-1/3 py-2 rounded-lg text-sm font-medium transition-colors bg-[#27272a] hover:bg-[#3f3f46] text-white"
        >
          Zrušit
        </button>
        <button
          onClick={handleApply}
          disabled={isInvalid}
          className={`w-2/3 py-2 rounded-lg text-sm font-medium transition-colors ${isInvalid
            ? 'bg-[#27272a] text-gray-500 cursor-not-allowed'
            : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white'
            }`}
        >
          Aplikovat
        </button>
      </div>
    </div>
  );
}

export function YearRangeFilterDropdown({ label, selected, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(popoverRef, () => setIsOpen(false), isOpen);

  const hasSelection = selected.min !== null || selected.max !== null;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors border text-sm ${hasSelection || isOpen
          ? 'bg-[#1c1c24] border-[#dc2626] text-white'
          : 'bg-[#111116] border-[#27272a] text-gray-400 hover:text-white hover:border-[#3f3f46]'
          }`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-[#1c1c24] border border-[#27272a] rounded-xl shadow-xl z-50 overflow-hidden">
          <YearRangeForm
            selected={selected}
            onChange={onChange}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
