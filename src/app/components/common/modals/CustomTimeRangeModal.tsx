import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';

type Props = {
  onClose: () => void;
  onSave: (from: number, to: number) => void;
};

export function CustomTimeRangeModal({ onClose, onSave }: Props) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!fromDate || !toDate) {
      setError('Vyplňte prosím obě data.');
      return;
    }

    const fromTimestamp = new Date(fromDate).setHours(0, 0, 0, 0);
    const toTimestamp = new Date(toDate).setHours(23, 59, 59, 999);

    if (fromTimestamp > toTimestamp) {
      setError('Počáteční datum nemůže být po koncovém datu.');
      return;
    }

    onSave(fromTimestamp, toTimestamp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onClose(); }}>
      <div
        className="w-full max-w-md bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#27272a]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-[#dc2626]" size={24} />
            Vlastní rozsah
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Od data</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => {
                setFromDate(e.target.value);
                setError('');
              }}
              className="form-input-dark"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Do data</label>
            <input
              type="date"
              value={toDate}
              onChange={e => {
                setToDate(e.target.value);
                setError('');
              }}
              className="form-input-dark"
            />
          </div>
        </div>

        <div className="p-6 border-t border-[#27272a] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-[#1c1c24] transition-colors"
          >
            Zrušit
          </button>
          <button
            onClick={handleSave}
            className="btn-action-primary"
          >
            Aplikovat
          </button>
        </div>
      </div>
    </div>
  );
}
