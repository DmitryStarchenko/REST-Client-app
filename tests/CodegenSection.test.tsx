import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/hooks/useCodegen', () => ({
  useCodegen: () => ({
    generateForLang: vi.fn().mockResolvedValue('test code'),
  }),
}));

vi.mock('@/components/client/Shared/index.tsx', () => ({
  CodeEditor: () => <div data-testid="code-editor">Editor</div>,
}));

vi.mock('@/components/client/RequestSection/Codegen/LangSelect.tsx', () => ({
  default: () => <select data-testid="lang-select">Select</select>,
}));

import CodegenSection from '@/components/client/RequestSection/Codegen';

describe('CodegenSection Component - Basic', () => {
  const mockProps = {
    method: 'GET',
    url: 'https://api.example.com/data',
    headers: [],
    body: '',
    codeLang: 'curl',
    setCodeLang: vi.fn(),
  };

  test('renders basic structure', () => {
    render(<CodegenSection {...mockProps} />);

    expect(screen.getByTestId('lang-select')).toBeInTheDocument();
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
  });
});
