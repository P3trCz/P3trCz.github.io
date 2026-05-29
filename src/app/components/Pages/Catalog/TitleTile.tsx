import React from 'react';
import { Title } from '../../../data/catalog';

type Props = {
  title: Title;
  onClick: (title: Title) => void;
};

export function TitleTile({ title, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(title)}
      className="flex items-center gap-3 bg-[#1c1c24] p-3 rounded-xl border border-transparent hover:border-[#dc2626] cursor-pointer transition-all"
    >
      <img src={title.poster_url} alt={title.title} className="w-12 h-18 object-cover rounded shadow-md" />
      <div className="min-w-0">
        <div className="font-bold text-white text-sm truncate">{title.title}</div>
        <div className="text-xs text-gray-500">{title.release_year} • {title.type}</div>
      </div>
    </div>
  );
}
