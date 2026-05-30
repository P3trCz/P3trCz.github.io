import React from 'react';
import { Title } from '../../data/catalog';
import { useTitleName } from '../../hooks/useTitleName';

type Props = {
  title: Title;
  onClick?: (title: Title) => void;
  action?: React.ReactNode;
  size?: 'sm' | 'md';
  isSelected?: boolean;
};

export function TitleTile({ title, onClick, action, size = 'md', isSelected = false }: Props) {
  const getTitleName = useTitleName();
  const isClickable = !!onClick;
  
  return (
    <div
      onClick={() => onClick && onClick(title)}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        isSelected
          ? 'bg-[#dc2626]/10 border-[#dc2626]/30 hover:bg-[#dc2626]/20'
          : `bg-[#1c1c24] border-[#27272a] ${isClickable ? 'hover:border-[#dc2626]' : ''}`
      } ${isClickable ? 'cursor-pointer' : ''}`}
    >
      <img 
        src={title.poster_url || undefined} 
        alt={getTitleName(title)} 
        className={`${size === 'sm' ? 'w-10 h-14' : 'w-12 h-18'} object-cover rounded shadow-md shrink-0`} 
      />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-white text-sm truncate">{getTitleName(title)}</div>
        <div className="text-xs text-gray-500 mt-1 truncate">{title.release_year} • {title.type}</div>
      </div>
      {action && (
        <div className="shrink-0 ml-2">
          {action}
        </div>
      )}
    </div>
  );
}
