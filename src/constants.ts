import { Dictionary } from './types';

export const COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-teal-500',
  'bg-cyan-500',
];

export const DICTIONARY: Record<'en' | 'ar', Dictionary> = {
  en: {
    title: 'Smart Habit Tracker',
    addHabit: 'Add New Habit',
    editHabit: 'Edit Habit',
    habitName: 'Habit Name',
    habitIcon: 'Icon (Emoji)',
    frequency: 'Frequency',
    daily: 'Daily',
    weekly: 'Weekly',
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    stats: 'Monthly Analytics',
    totalHabits: 'Total Habits',
    completedToday: 'Completed Today',
    completionRate: 'Completion Rate',
    personalInsights: 'Personal Insights',
    streaks: 'Best Streaks',
    bestDay: 'Most Productive Day',
    weakDay: 'Needs Improvement',
    noHabits: 'No habits yet. Start by adding one!',
    confirmDelete: 'Are you sure you want to delete this habit?',
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    dayShortNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  ar: {
    title: 'متتبع العادات الذكي',
    addHabit: 'إضافة عادة جديدة',
    editHabit: 'تعديل العادة',
    habitName: 'اسم العادة',
    habitIcon: 'الأيقونة (إيموجي)',
    frequency: 'التكرار',
    daily: 'يومي',
    weekly: 'أسبوعي',
    save: 'حفظ التغييرات',
    cancel: 'إلغاء',
    delete: 'حذف',
    stats: 'التحليلات الشهرية',
    totalHabits: 'إجمالي العادات',
    completedToday: 'اكتمل اليوم',
    completionRate: 'نسبة الإنجاز',
    personalInsights: 'ملخص الأداء الشخصي',
    streaks: 'أفضل السلاسل',
    bestDay: 'اليوم الأكثر إنتاجية',
    weakDay: 'يحتاج إلى تحسين',
    noHabits: 'لا توجد عادات بعد. ابدأ بإضافة واحدة!',
    confirmDelete: 'هل أنت متأكد من حذف هذه العادة؟',
    monthNames: [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ],
    dayShortNames: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
  }
};
