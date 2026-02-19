import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders empty state in Arabic by default', () => {
    render(<App />);
    expect(screen.getByText('متتبع العادات الذكي')).toBeInTheDocument();
    expect(screen.getAllByText('لا توجد عادات بعد. ابدأ بإضافة واحدة!').length).toBeGreaterThan(0);
  });

  it('toggles language from Arabic to English', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'EN' }));
    expect(screen.getByText('Smart Habit Tracker')).toBeInTheDocument();
    expect(screen.getAllByText('No habits yet. Start by adding one!').length).toBeGreaterThan(0);
  });

  it('can add a new habit from the modal', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /إضافة عادة جديدة/i }));
    fireEvent.change(screen.getByPlaceholderText('مثل: القراءة'), {
      target: { value: 'مذاكرة' },
    });
    fireEvent.click(screen.getByRole('button', { name: /حفظ التغييرات/i }));

    expect(screen.getAllByText('مذاكرة').length).toBeGreaterThan(0);
  });
});
