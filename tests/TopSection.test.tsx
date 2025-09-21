import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import TopSection from '@/components/client/TopSection';
import { Header } from '@/types';

vi.mock('@/components/client/TopSection/Headers', () => ({
  default: vi.fn(({ headers, setHeaders }) => (
    <div data-testid="headers-block">
      <div data-testid="headers-count">{headers.length}</div>
      <button
        data-testid="add-header"
        onClick={() => setHeaders([...headers, { key: '', value: '', id: 'new-id' }])}
      >
        Add Header
      </button>
    </div>
  )),
}));

vi.mock('@/components/client/TopSection/Body', () => ({
  default: vi.fn(({ bodyText, setBodyText }) => (
    <div data-testid="body-block">
      <textarea
        data-testid="body-editor"
        value={bodyText}
        onChange={(e) => setBodyText(e.target.value)}
      />
    </div>
  )),
}));

vi.mock('@/components/client/TopSection/Codegen', () => ({
  default: vi.fn(({ method, url, headers, body, codeLang, setCodeLang }) => (
    <div data-testid="codegen-block">
      <div data-testid="method">{method}</div>
      <div data-testid="url">{url}</div>
      <div data-testid="headers-count">{headers.length}</div>
      <div data-testid="body">{body}</div>
      <div data-testid="code-lang">{codeLang}</div>
      <button data-testid="set-js-button" onClick={() => setCodeLang('javascript')}>
        Set JS
      </button>
    </div>
  )),
}));

vi.mock('@mui/icons-material', () => ({
  ExpandLess: () => <span data-testid="expand-less-icon">ExpandLess</span>,
  ExpandMore: () => <span data-testid="expand-more-icon">ExpandMore</span>,
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'TopSection.Request Headers': 'Request Headers',
      'TopSection.Request Body': 'Request Body',
      'TopSection.Codegen': 'Codegen',
    };
    return translations[key] || key;
  },
}));

vi.mock('@/utils', () => ({
  uid: vi.fn(() => 'mock-id'),
}));

describe('TopSection Component', () => {
  const mockHeaders: Header[] = [
    { id: '1', key: 'Content-Type', value: 'application/json' },
    { id: '2', key: 'Authorization', value: 'Bearer token' },
  ];

  const defaultProps = {
    headers: mockHeaders,
    setHeaders: vi.fn(),
    bodyText: '{"test": "data"}',
    setBodyText: vi.fn(),
    method: 'POST',
    url: 'https://api.example.com/users',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders all tabs and collapse/expand button', () => {
    render(<TopSection {...defaultProps} />);

    expect(screen.getByText('Request Headers')).toBeInTheDocument();
    expect(screen.getByText('Request Body')).toBeInTheDocument();
    expect(screen.getByText('Codegen')).toBeInTheDocument();
    expect(screen.getByTestId('expand-less-icon')).toBeInTheDocument();
  });

  test('shows Request Headers tab by default', () => {
    render(<TopSection {...defaultProps} />);

    expect(screen.getByTestId('headers-block')).toBeInTheDocument();
    expect(screen.queryByTestId('body-block')).not.toBeInTheDocument();
    expect(screen.queryByTestId('codegen-block')).not.toBeInTheDocument();
  });

  test('switches to Request Body tab when clicked', () => {
    render(<TopSection {...defaultProps} />);

    const bodyTab = screen.getByText('Request Body');
    fireEvent.click(bodyTab);

    expect(screen.getByTestId('body-block')).toBeInTheDocument();
    expect(screen.queryByTestId('headers-block')).not.toBeInTheDocument();
    expect(screen.queryByTestId('codegen-block')).not.toBeInTheDocument();
  });

  test('switches to Codegen tab when clicked', () => {
    render(<TopSection {...defaultProps} />);

    const codegenTab = screen.getByText('Codegen');
    fireEvent.click(codegenTab);

    expect(screen.getByTestId('codegen-block')).toBeInTheDocument();
    expect(screen.queryByTestId('headers-block')).not.toBeInTheDocument();
    expect(screen.queryByTestId('body-block')).not.toBeInTheDocument();
  });

  test('can switch back to Request Headers tab from other tabs', () => {
    render(<TopSection {...defaultProps} />);

    const codegenTab = screen.getByText('Codegen');
    fireEvent.click(codegenTab);
    expect(screen.getByTestId('codegen-block')).toBeInTheDocument();

    const headersTab = screen.getByText('Request Headers');
    fireEvent.click(headersTab);
    expect(screen.getByTestId('headers-block')).toBeInTheDocument();
    expect(screen.queryByTestId('codegen-block')).not.toBeInTheDocument();
  });

  test('collapses and expands content when button is clicked', () => {
    render(<TopSection {...defaultProps} />);

    expect(screen.getByTestId('headers-block')).toBeInTheDocument();

    const collapseButtons = screen.getAllByRole('button');
    const collapseButton = collapseButtons[0];
    fireEvent.click(collapseButton);

    expect(screen.queryByTestId('headers-block')).not.toBeInTheDocument();
    expect(screen.getByTestId('expand-more-icon')).toBeInTheDocument();

    fireEvent.click(collapseButton);

    expect(screen.getByTestId('headers-block')).toBeInTheDocument();
    expect(screen.getByTestId('expand-less-icon')).toBeInTheDocument();
  });

  test('passes correct props to Headers component', () => {
    render(<TopSection {...defaultProps} />);

    const headersBlock = screen.getByTestId('headers-block');
    expect(headersBlock).toBeInTheDocument();
    expect(screen.getByTestId('headers-count')).toHaveTextContent('2');
  });

  test('passes correct props to Body component', () => {
    render(<TopSection {...defaultProps} />);

    const bodyTab = screen.getByText('Request Body');
    fireEvent.click(bodyTab);

    const bodyEditor = screen.getByTestId('body-editor');
    expect(bodyEditor).toHaveValue('{"test": "data"}');
  });

  test('passes correct props to Codegen component', () => {
    render(<TopSection {...defaultProps} />);

    const codegenTab = screen.getByText('Codegen');
    fireEvent.click(codegenTab);

    expect(screen.getByTestId('method')).toHaveTextContent('POST');
    expect(screen.getByTestId('url')).toHaveTextContent('https://api.example.com/users');
    expect(screen.getByTestId('headers-count')).toHaveTextContent('2');
    expect(screen.getByTestId('body')).toHaveTextContent('{"test": "data"}');
  });

  test('provides default empty header when headers array is empty', () => {
    const propsWithEmptyHeaders = {
      ...defaultProps,
      headers: [],
    };

    render(<TopSection {...propsWithEmptyHeaders} />);

    const headersBlock = screen.getByTestId('headers-block');
    expect(headersBlock).toBeInTheDocument();
    expect(screen.getByTestId('headers-count')).toHaveTextContent('1');
  });

  test('maintains tab state when collapsing and expanding', () => {
    render(<TopSection {...defaultProps} />);

    const codegenTab = screen.getByText('Codegen');
    fireEvent.click(codegenTab);
    expect(screen.getByTestId('codegen-block')).toBeInTheDocument();

    const collapseButtons = screen.getAllByRole('button');
    const collapseButton = collapseButtons[0];
    fireEvent.click(collapseButton);
    expect(screen.queryByTestId('codegen-block')).not.toBeInTheDocument();

    fireEvent.click(collapseButton);
    expect(screen.getByTestId('codegen-block')).toBeInTheDocument();
  });

  test('handles headers changes from Headers component', () => {
    const setHeadersMock = vi.fn();
    const props = {
      ...defaultProps,
      setHeaders: setHeadersMock,
    };

    render(<TopSection {...props} />);

    const addButton = screen.getByTestId('add-header');
    fireEvent.click(addButton);

    expect(setHeadersMock).toHaveBeenCalledWith([
      ...mockHeaders,
      { key: '', value: '', id: 'new-id' },
    ]);
  });

  test('handles body text changes from Body component', () => {
    const setBodyTextMock = vi.fn();
    const props = {
      ...defaultProps,
      setBodyText: setBodyTextMock,
    };

    render(<TopSection {...props} />);

    const bodyTab = screen.getByText('Request Body');
    fireEvent.click(bodyTab);

    const bodyEditor = screen.getByTestId('body-editor');
    fireEvent.change(bodyEditor, { target: { value: 'new body content' } });

    expect(setBodyTextMock).toHaveBeenCalledWith('new body content');
  });

  test('applies correct styles to active tab', () => {
    render(<TopSection {...defaultProps} />);

    const headersTab = screen.getByText('Request Headers');
    expect(headersTab).toHaveAttribute('aria-selected', 'true');

    const bodyTab = screen.getByText('Request Body');
    expect(bodyTab).toHaveAttribute('aria-selected', 'false');
  });

  test('handles code language changes from Codegen component', () => {
    render(<TopSection {...defaultProps} />);

    const codegenTab = screen.getByText('Codegen');
    fireEvent.click(codegenTab);

    const setJsButton = screen.getByTestId('set-js-button');
    fireEvent.click(setJsButton);

    expect(screen.getByTestId('codegen-block')).toBeInTheDocument();
  });
});
