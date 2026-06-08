import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreHistorySidebar } from './ScoreHistorySidebar';
import type { ScoreHistoryEntry } from '../types/game';

const entries: ScoreHistoryEntry[] = [
  { score: 5000, date: '6/1/2026' },
  { score: 3200, date: '6/2/2026' },
  { score: 1800, date: '6/3/2026' },
];

describe('ScoreHistorySidebar', () => {
  it('renders the heading', () => {
    render(<ScoreHistorySidebar entries={[]} />);
    expect(screen.getByText(/score history/i)).toBeInTheDocument();
  });

  it('shows empty state message when no entries', () => {
    render(<ScoreHistorySidebar entries={[]} />);
    expect(screen.getByText(/no games yet/i)).toBeInTheDocument();
  });

  it('renders all entry scores when entries provided', () => {
    render(<ScoreHistorySidebar entries={entries} />);
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('3,200')).toBeInTheDocument();
    expect(screen.getByText('1,800')).toBeInTheDocument();
  });

  it('renders all entry dates', () => {
    render(<ScoreHistorySidebar entries={entries} />);
    expect(screen.getByText('6/1/2026')).toBeInTheDocument();
    expect(screen.getByText('6/2/2026')).toBeInTheDocument();
    expect(screen.getByText('6/3/2026')).toBeInTheDocument();
  });

  it('does not show empty state when entries are present', () => {
    render(<ScoreHistorySidebar entries={entries} />);
    expect(screen.queryByText(/no games yet/i)).not.toBeInTheDocument();
  });

  it('renders 20 entries without crashing', () => {
    const manyEntries: ScoreHistoryEntry[] = Array.from({ length: 20 }, (_, i) => ({
      score: (i + 1) * 100,
      date: `6/${i + 1}/2026`,
    }));
    render(<ScoreHistorySidebar entries={manyEntries} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('2,000')).toBeInTheDocument();
  });
});
