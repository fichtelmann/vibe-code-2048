import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeaderboardButton } from './LeaderboardButton';

describe('LeaderboardButton', () => {
  it('renders with correct accessible label', () => {
    render(<LeaderboardButton onClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: /open leaderboard/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<LeaderboardButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
