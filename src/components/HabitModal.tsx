
import React, { useState, useEffect } from 'react';
import { Habit, Language } from '../types';
import { COLORS, DICTIONARY } from '../constants';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Partial<Habit>) => void;
  onDelete?: (id: string) => void;
  editingHabit?: Habit | null;
  lang: Language;
}

const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, onSave, onDelete, editingHabit, lang }) => {
  const dict = DICTIONARY[lang];
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💪');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setIcon(editingHabit.icon);
      setFrequency(editingHabit.frequency);
      setColor(editingHabit.color);
    } else {
      setName('');
      setIcon('💪');
      setFrequency('daily');
      setColor(COLORS[0]);
    }
  }, [editingHabit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, icon, frequency, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {editingHabit ? dict.editHabit : dict.addHabit}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{dict.habitName}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              placeholder={lang === 'ar' ? 'مثل: القراءة' : 'e.g. Reading'}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{dict.habitIcon}</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{dict.frequency}</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="daily">{dict.daily}</option>
                <option value="weekly">{dict.weekly}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Theme Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${c} ${color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-60'} transition-all`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-100"
            >
              {dict.save}
            </button>
            {editingHabit && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(dict.confirmDelete)) {
                    onDelete?.(editingHabit.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 font-semibold rounded-lg hover:bg-rose-100 transition-colors"
              >
                {dict.delete}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-50 text-slate-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              {dict.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;