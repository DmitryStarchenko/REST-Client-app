import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LayoutHistoryContent from '@/components/layout/History/LayoutHistoryContent';
import { createClient } from '@/lib/supabase/server';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@mui/material', () => ({
  Container: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  Table: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <table className={className}>{children}</table>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
  TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
  TableHead: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
  TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
  Typography: ({
    variant,
    children,
    color,
  }: {
    variant?: string;
    children: React.ReactNode;
    color?: string;
  }) => {
    const Tag = variant?.startsWith('h')
      ? (variant.replace('h', 'h') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5')
      : 'p';
    return <Tag className={color === 'error' ? 'error' : ''}>{children}</Tag>;
  },
}));

vi.mock('./History.module.css', () => ({
  main: 'main-class',
  notRequest: 'not-request-class',
  logoEmpty: 'logo-empty-class',
  navButton: 'nav-button-class',
  table: 'table-class',
}));

describe('LayoutHistoryContent', () => {
  const mockGetTranslations = vi.fn();
  const mockAuthGetUser = vi.fn();
  const mockSupabaseFrom = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (getTranslations as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockGetTranslations);

    (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      auth: {
        getUser: mockAuthGetUser,
      },
      from: mockSupabaseFrom,
    });
  });

  it('should render empty state when no history data', async () => {
    mockAuthGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    mockSupabaseFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    });

    mockGetTranslations.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        title: 'History Title',
        text: 'No requests found',
        timestamp: 'Timestamp',
        method: 'Method',
        status: 'Status',
        url: 'URL',
        requestSize: 'Request Size',
        responseSize: 'Response Size',
        duration: 'Duration',
        error_text: 'Error',
        error: 'Error:',
      };
      return translations[key] || key;
    });

    const mockGetMainTranslations = vi.fn();
    mockGetMainTranslations.mockImplementation((key: string) => {
      const mainTranslations: Record<string, string> = {
        client: 'Client Page',
      };

      return mainTranslations[key] || key;
    });

    (getTranslations as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockGetTranslations)
      .mockResolvedValueOnce(mockGetMainTranslations);

    const Component = await LayoutHistoryContent({});
    render(Component);

    expect(screen.getByText('History Title')).toBeInTheDocument();
    expect(screen.getByText('No requests found')).toBeInTheDocument();
    expect(screen.getByText('Client Page')).toBeInTheDocument();
  });

  it('should handle database error', async () => {
    mockAuthGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    mockSupabaseFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
      }),
    });

    mockGetTranslations.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        title: 'History',
        error: 'Error:',
      };
      return translations[key] || key;
    });

    const mockGetMainTranslations = vi.fn();
    (getTranslations as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockGetTranslations)
      .mockResolvedValueOnce(mockGetMainTranslations);

    const Component = await LayoutHistoryContent({});
    render(Component);

    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Error: Database connection failed')).toBeInTheDocument();
  });

  it('should handle unknown errors', async () => {
    mockAuthGetUser.mockRejectedValue('Some string error');

    mockGetTranslations.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        title: 'History',
        error: 'Error:',
      };
      return translations[key] || key;
    });

    const mockGetMainTranslations = vi.fn();
    (getTranslations as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockGetTranslations)
      .mockResolvedValueOnce(mockGetMainTranslations);

    const Component = await LayoutHistoryContent({});
    render(Component);

    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Error: Unknown error occurred')).toBeInTheDocument();
  });
});
