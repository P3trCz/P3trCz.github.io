import { Search } from 'lucide-react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  iconSize?: number;
};

/**
 * Vyhledávací input pro modální okna, vyhledávání přátel, titulů, playlistů atd.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Hledat...',
  autoFocus = false,
  className = '',
  iconSize = 16,
}: SearchInputProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Search size={iconSize} />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full pl-9 pr-4 py-2 bg-[#1c1c24] border border-[#27272a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#dc2626] transition-colors text-sm ${className}`}
      />
    </div>
  );
}
