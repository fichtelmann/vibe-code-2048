import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeaderboardPopup } from './LeaderboardPopup';
import type { LeaderboardEntry } from '../types/game';

const entries: LeaderboardEntry[] = [
  { rank: 1, score: 5000, date: '6/1/2026' },
  { rank: 2, score: 3200, date: '6/2/2026' },
  { rank: 3, score: 1800, date: '6/3/2026' },
];

describe('LeaderboardPopup', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <LeaderboardPopup isOpen={false} entries={entries} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders leaderboard entries when open', () => {
    render(<LeaderboardPopup isOpen entries={entries} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('3,200')).toBeInTheDocument();
    expect(screen.getByText('1,800')).toBeInTheDocument();
  });

  it('shows empty state message when no entries', () => {
    render(<LeaderboardPopup isOpen entries={[]} onClose={vi.fn()} />);
    expect(screen.getByText(/no scores yet/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<LeaderboardPopup isOpen entries={entries} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close leaderboard'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<LeaderboardPopup isOpen entries={entries} onClose={onClose} />);
    // The backdrop is the aria-hidden div behind the panel
    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<LeaderboardPopup isOpen entries={entries} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose on Escape when closed', () => {
    const onClose = vi.fn();
    render(<LeaderboardPopup isOpen={false} entries={entries} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
