import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Mode } from '@/types/theme.types';

import ThemeToggler from '../src/components/layout/ThemeToggler/ThemeToggler';

vi.mock('@mui/icons-material/DarkMode', () => ({
  default: () => <div data-testid="dark-mode-icon">DarkModeIcon</div>,
}));

vi.mock('@mui/icons-material/Language', () => ({
  default: () => <div data-testid="language-icon">LanguageIcon</div>,
}));

vi.mock('@mui/icons-material/LightMode', () => ({
  default: () => <div data-testid="light-mode-icon">LightModeIcon</div>,
}));

const mockSetMode = vi.fn();
const mockUseColorScheme = vi.fn();

vi.mock('@mui/material/styles', () => ({
  useColorScheme: () => mockUseColorScheme(),
}));

describe('ThemeToggler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when mode is not defined', () => {
    mockUseColorScheme.mockReturnValue({ mode: undefined, setMode: mockSetMode });

    const { container } = render(<ThemeToggler />);

    expect(container.firstChild).toBeNull();
  });

  it('displays an icon when it is system', () => {
    mockUseColorScheme.mockReturnValue({ mode: 'system' as Mode, setMode: mockSetMode });

    render(<ThemeToggler />);

    expect(screen.getByTestId('language-icon')).toBeInTheDocument();
  });

  it('displays an icon when it is light', () => {
    mockUseColorScheme.mockReturnValue({ mode: 'light' as Mode, setMode: mockSetMode });

    render(<ThemeToggler />);

    expect(screen.getByTestId('light-mode-icon')).toBeInTheDocument();
  });

  it('displays an icon when it is dark', () => {
    mockUseColorScheme.mockReturnValue({ mode: 'dark' as Mode, setMode: mockSetMode });

    render(<ThemeToggler />);

    expect(screen.getByTestId('dark-mode-icon')).toBeInTheDocument();
  });

  it('switches modes by clicking', async () => {
    let currentMode: Mode = 'system';
    const setMode = (mode: Mode): void => {
      currentMode = mode;
    };

    mockUseColorScheme.mockImplementation(() => ({
      mode: currentMode,
      setMode,
    }));
    const { rerender } = render(<ThemeToggler />);

    await userEvent.click(screen.getByRole('button'));
    expect(currentMode).toBe('light');

    rerender(<ThemeToggler />);
    expect(screen.getByTestId('light-mode-icon')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button'));
    expect(currentMode).toBe('dark');

    rerender(<ThemeToggler />);
    expect(screen.getByTestId('dark-mode-icon')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button'));
    expect(currentMode).toBe('system');

    rerender(<ThemeToggler />);
    expect(screen.getByTestId('language-icon')).toBeInTheDocument();
  });
});
