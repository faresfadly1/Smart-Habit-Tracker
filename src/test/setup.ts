import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

const PassThrough = ({ children }: { children?: React.ReactNode }) =>
  React.createElement('div', null, children);

const Bare = () => React.createElement('div');

vi.mock('recharts', () => ({
  ResponsiveContainer: PassThrough,
  BarChart: PassThrough,
  Bar: PassThrough,
  XAxis: Bare,
  YAxis: Bare,
  Tooltip: Bare,
  Cell: Bare,
}));
