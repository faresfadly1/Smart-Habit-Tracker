import React, { useState, useEffect, useMemo } from 'react';
import { Habit, TrackingData, Language } from './types';
import { DICTIONARY } from './constants';
import HabitModal from './components/HabitModal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tracking, setTracking] = useState<TrackingData>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const dict = DICTIONARY[lang];

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedHabits = localStorage.getItem('habits');
      const savedTracking = localStorage.getItem('tracking');
      if (savedHabits) setHabits(JSON.parse(savedHabits));
      if (savedTracking) setTracking(JSON.parse(savedTracking));
    } catch (error) {
      console.error('Failed to parse local storage data:', error);
      localStorage.removeItem('habits');
      localStorage.removeItem('tracking');
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('tracking', JSON.stringify(tracking));
  }, [habits, tracking]);

  const toggleLanguage = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'));

  const addOrUpdateHabit = (data: Partial<Habit>) => {
    if (editingHabit) {
      setHabits(prev => prev.map(h => h.id === editingHabit.id ? { ...h, ...data } : h));
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name: data.name!,
        icon: data.icon!,
        frequency: data.frequency!,
        color: data.color!,
        createdAt: Date.now()
      };
      setHabits(prev => [...prev, newHabit]);
    }
    setEditingHabit(null);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    // Optional: Clean up tracking data too
  };

  const toggleDay = (date: string, habitId: string) => {
    setTracking(prev => {
      const dayData = prev[date] || {};
      return {
        ...prev,
        [date]: {
          ...dayData,
          [habitId]: !dayData[habitId]
        }
      };
    });
  };

  const generateDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [currentMonth, currentYear]);

  const getDateString = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const calculateStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = tracking[today] || {};
    const completedToday = Object.values(todayData).filter(v => v).length;

    let totalPossible = habits.length * generateDays.length;
    let totalDone = 0;
    generateDays.forEach(d => {
      const dayData = tracking[getDateString(d)] || {};
      totalDone += Object.values(dayData).filter(v => v).length;
    });

    const monthlyCompletionRate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

    return { completedToday, monthlyCompletionRate, totalDone };
  }, [tracking, habits, generateDays, currentMonth, currentYear]);

  const habitStreaks = useMemo(() => {
    return habits.map(h => {
      let streak = 0;
      const now = new Date();
      for (let i = 0; i < 60; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        if (tracking[dStr]?.[h.id]) {
          streak++;
        } else {
          break;
        }
      }
      return { name: h.name, icon: h.icon, currentStreak: streak };
    });
  }, [habits, tracking]);

  const chartData = useMemo(() => {
    return habits.map(h => {
      let count = 0;
      generateDays.forEach(d => {
        if (tracking[getDateString(d)]?.[h.id]) count++;
      });
      return { name: h.name, completed: count };
    });
  }, [habits, tracking, generateDays]);

  const personalInsights = useMemo(() => {
    if (habits.length === 0) {
      return [dict.noHabits];
    }

    const topStreak = [...habitStreaks].sort((a, b) => b.currentStreak - a.currentStreak)[0];
    const lowProgress = chartData.filter(item => item.completed < Math.max(3, Math.ceil(generateDays.length * 0.3)));

    if (lang === 'ar') {
      return [
        `نسبة الإنجاز هذا الشهر: ${calculateStats.monthlyCompletionRate}%`,
        topStreak
          ? `أفضل سلسلة حالية: ${topStreak.icon} ${topStreak.name} (${topStreak.currentStreak} يوم).`
          : 'ابدأ اليوم بعادة واحدة لبناء سلسلة مستمرة.',
        lowProgress.length > 0
          ? `ركّز هذا الأسبوع على: ${lowProgress.slice(0, 2).map(h => h.name).join('، ')}`
          : 'أداء ممتاز هذا الشهر. حافظ على نفس الوتيرة.'
      ];
    }

    return [
      `Monthly completion rate: ${calculateStats.monthlyCompletionRate}%`,
      topStreak
        ? `Best current streak: ${topStreak.icon} ${topStreak.name} (${topStreak.currentStreak} days).`
        : 'Start with one habit today to build momentum.',
      lowProgress.length > 0
        ? `Focus this week on: ${lowProgress.slice(0, 2).map(h => h.name).join(', ')}`
        : 'Great consistency this month. Keep going.'
    ];
  }, [habits, habitStreaks, chartData, generateDays.length, calculateStats.monthlyCompletionRate, lang, dict.noHabits]);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 pb-12`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">
              {dict.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1))}
                className="p-1.5 hover:bg-white rounded-md transition-all shadow-sm"
              >
                <svg className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span className="px-3 text-sm font-semibold min-w-[100px] text-center">
                {dict.monthNames[currentMonth]} {currentYear}
              </span>
              <button
                onClick={() => setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1))}
                className="p-1.5 hover:bg-white rounded-md transition-all shadow-sm"
              >
                <svg className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            <button
              onClick={toggleLanguage}
              className="px-4 py-1.5 text-sm font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors uppercase"
            >
              {lang === 'en' ? 'العربية' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{dict.totalHabits}</p>
                <p className="text-2xl font-bold text-slate-800">{habits.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold">#</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{dict.completedToday}</p>
                <p className="text-2xl font-bold text-slate-800">{calculateStats.completedToday}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center gap-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-slate-500">{dict.completionRate}</p>
                <span className="text-sm font-bold text-emerald-600">{calculateStats.monthlyCompletionRate}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-1000"
                  style={{ width: `${calculateStats.monthlyCompletionRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-700">{dict.monthNames[currentMonth]} Progress</h2>
              <button
                onClick={() => { setEditingHabit(null); setIsModalOpen(true); }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-emerald-100 flex items-center gap-2"
              >
                <span className="text-lg">+</span> {dict.addHabit}
              </button>
            </div>

            <div className="overflow-x-auto relative">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4 text-start sticky left-0 z-20 bg-slate-50 min-w-[180px] border-e border-slate-200">
                      {lang === 'ar' ? 'العادة' : 'Habit'}
                    </th>
                    {generateDays.map(day => (
                      <th key={day} className="p-2 min-w-[40px] border-b border-slate-100">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {habits.length === 0 ? (
                    <tr>
                      <td colSpan={generateDays.length + 1} className="p-12 text-center text-slate-400">
                        {dict.noHabits}
                      </td>
                    </tr>
                  ) : (
                    habits.map(habit => (
                      <tr key={habit.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td
                          className="p-4 sticky left-0 z-10 bg-white group-hover:bg-slate-50/80 border-e border-slate-200 transition-colors"
                          onClick={() => { setEditingHabit(habit); setIsModalOpen(true); }}
                        >
                          <div className="flex items-center gap-3 cursor-pointer">
                            <span className="text-2xl">{habit.icon}</span>
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-700 text-sm line-clamp-1">{habit.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {habit.frequency === 'daily' ? dict.daily : dict.weekly}
                              </span>
                            </div>
                          </div>
                        </td>
                        {generateDays.map(day => {
                          const dateStr = getDateString(day);
                          const isDone = tracking[dateStr]?.[habit.id] || false;
                          const isToday = dateStr === new Date().toISOString().split('T')[0];
                          return (
                            <td key={day} className="p-1 text-center border-b border-slate-100">
                              <button
                                onClick={() => toggleDay(dateStr, habit.id)}
                                className={`
                                  w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 border-2
                                  ${isDone
                                    ? `${habit.color} border-transparent text-white scale-100 shadow-sm`
                                    : 'bg-white border-slate-200 hover:border-slate-300 scale-90 opacity-60'
                                  }
                                  ${isToday && !isDone ? 'ring-2 ring-emerald-200' : ''}
                                `}
                              >
                                {isDone && (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">{dict.stats}</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="completed" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} className={habits[index]?.color.replace('bg-', 'fill-')} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl shadow-xl shadow-emerald-100 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 bg-white/20 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
                </span>
                <h3 className="font-bold">{dict.personalInsights}</h3>
              </div>

              <div className="space-y-2">
                {personalInsights.map((item, index) => (
                  <p key={index} className="text-sm leading-relaxed text-emerald-50 bg-emerald-800/30 p-3 rounded-xl border border-emerald-300/30">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">{dict.streaks}</h3>
            <div className="space-y-4">
              {habitStreaks.slice(0, 5).map((streak, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{streak.icon}</span>
                    <span className="text-sm font-semibold text-slate-700">{streak.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold text-amber-500">{streak.currentStreak}</span>
                    <span className="text-amber-500">🔥</span>
                  </div>
                </div>
              ))}
              {habits.length === 0 && <p className="text-xs text-slate-400 text-center">{dict.noHabits}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                 </div>
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{dict.bestDay}</h4>
               </div>
               <p className="text-lg font-bold text-slate-800">
                 {generateDays.reduce((best, d) => {
                    const dStr = getDateString(d);
                    const count = Object.values(tracking[dStr] || {}).filter(v => v).length;
                    return count > best.count ? { d, count } : best;
                 }, { d: 1, count: 0 }).count > 0
                  ? `${dict.dayShortNames[new Date(currentYear, currentMonth, generateDays.reduce((best, d) => {
                    const dStr = getDateString(d);
                    const count = Object.values(tracking[dStr] || {}).filter(v => v).length;
                    return count > best.count ? { d, count } : best;
                  }, { d: 1, count: 0 }).d).getDay()]}`
                  : '-'}
               </p>
            </div>
          </div>
        </div>
      </main>

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingHabit(null); }}
        onSave={addOrUpdateHabit}
        onDelete={deleteHabit}
        editingHabit={editingHabit}
        lang={lang}
      />
    </div>
  );
};

export default App;
