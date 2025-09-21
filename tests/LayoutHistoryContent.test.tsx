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

interface MockHistoryItem {
  id: string;
  timestamp: string;
  method: string;
  response_status: number | null;
  url: string;
  path: string;
  request_size: number;
  response_size: number;
  duration_ms: number;
  error_details: string | null;
}

describe('LayoutHistoryContent', () => {
  const mockGetTranslations = vi.fn();
  const mockAuthGetUser = vi.fn();
  const mockSupabaseFrom = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock timezone to UTC for consistent test results
    vi.stubEnv('TZ', 'UTC');

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

  it('should render history table with data', async () => {
    const mockUser = { id: 'user-123' };
    const mockHistory: MockHistoryItem[] = [
      {
        id: '1',
        timestamp: '2023-12-01T10:30:00Z',
        method: 'GET',
        response_status: 200,
        url: 'https://example.com/api',
        path: '/api',
        request_size: 1024,
        response_size: 2048,
        duration_ms: 150,
        error_details: null,
      },
      {
        id: '2',
        timestamp: '2023-12-01T09:15:00Z',
        method: 'POST',
        response_status: 404,
        url: 'https://example.com/create',
        path: '/create',
        request_size: 159,
        response_size: 357,
        duration_ms: 255,
        error_details: 'Not found',
      },
    ];

    mockAuthGetUser.mockResolvedValue({
      data: { user: mockUser },
    });

    mockSupabaseFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: mockHistory,
        error: null,
      }),
    });

    mockGetTranslations.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        title: 'Request History',
        timestamp: 'Time',
        method: 'HTTP Method',
        status: 'Status Code',
        url: 'URL',
        requestSize: 'Req Size',
        responseSize: 'Resp Size',
        duration: 'Duration (ms)',
        error_text: 'Error Details',
      };
      return translations[key] || key;
    });

    const mockGetMainTranslations = vi.fn();
    (getTranslations as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockGetTranslations)
      .mockResolvedValueOnce(mockGetMainTranslations);

    const Component = await LayoutHistoryContent({});
    render(Component);

    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('HTTP Method')).toBeInTheDocument();
    expect(screen.getByText('Status Code')).toBeInTheDocument();
    expect(screen.getByText('URL')).toBeInTheDocument();
    expect(screen.getByText('Req Size')).toBeInTheDocument();
    expect(screen.getByText('Resp Size')).toBeInTheDocument();
    expect(screen.getByText('Duration (ms)')).toBeInTheDocument();
    expect(screen.getByText('Error Details')).toBeInTheDocument();
    // Calculate expected formatted dates based on the same logic as the component
    const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const expectedDate1 = formatDate('2023-12-01T10:30:00Z');
    const expectedDate2 = formatDate('2023-12-01T09:15:00Z');

    expect(screen.getByText(expectedDate1)).toBeInTheDocument();
    expect(screen.getByText(expectedDate2)).toBeInTheDocument();
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/api')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/create')).toBeInTheDocument();
    expect(screen.getByText('1024')).toBeInTheDocument();
    expect(screen.getByText('159')).toBeInTheDocument();
    expect(screen.getByText('2048')).toBeInTheDocument();
    expect(screen.getByText('357')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('255')).toBeInTheDocument();
    expect(screen.getByText('Not found')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
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
