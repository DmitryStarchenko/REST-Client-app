import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import RestClient from '@/components/client/Components';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

vi.mock('usehooks-ts', () => ({
  useLocalStorage: () => [[], vi.fn()],
}));

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('@/utils', () => ({
  parseRestPath: () => ({
    method: 'GET',
    url: '',
    body: '',
    headers: [],
  }),
  sendRestRequest: vi.fn(),
  uid: () => 'mock-id',
}));

vi.mock('@/utils/variable', () => ({
  replaceVariables: (str: string) => str,
}));

vi.mock('@/constants', () => ({
  VARIABLES_KEY: 'variables',
}));

vi.mock('@/components/client/BottomSection', () => ({
  default: () => <div>Bottom Section</div>,
}));

vi.mock('@/components/client/EndpointSection', () => ({
  default: () => <div>Endpoint Section</div>,
}));

vi.mock('@/components/client/RequestSection', () => ({
  default: () => <div>Top Section</div>,
}));

describe('RestClient - Simple', () => {
  it('should render without crashing', () => {
    render(<RestClient />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('should render all sections', () => {
    render(<RestClient />);
    expect(screen.getByText('Endpoint Section')).toBeInTheDocument();
    expect(screen.getByText('Top Section')).toBeInTheDocument();
    expect(screen.getByText('Bottom Section')).toBeInTheDocument();
  });
});
