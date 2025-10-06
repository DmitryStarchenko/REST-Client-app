import { render } from '@testing-library/react';
import { notFound } from 'next/navigation';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import MethodPage from '../src/app/[locale]/(protected)/client/[method]/[[...params]]/page';
import type { PageProps } from '../src/types';
import { isValidMethod } from '../src/utils/isValidMethod';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('../src/utils/isValidMethod', () => ({
  isValidMethod: vi.fn(),
}));

vi.mock('../src/components/client', () => ({
  default: () => <div data-testid="client-wrapper">Client Wrapper</div>,
}));

describe('MethodPage', () => {
  const mockedNotFound = vi.mocked(notFound);
  const mockedIsValidMethod = vi.mocked(isValidMethod);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render ClientWrapper when method is valid', async () => {
    const mockParams = { locale: 'en', method: 'get' };
    const props: PageProps = { params: Promise.resolve(mockParams) };
    mockedIsValidMethod.mockReturnValue(true);
    const { findByTestId } = render(await MethodPage(props));
    expect(await findByTestId('client-wrapper')).toBeInTheDocument();
    expect(mockedIsValidMethod).toHaveBeenCalledWith('GET');
    expect(mockedNotFound).not.toHaveBeenCalled();
  });

  it('should call notFound when method is undefined', async () => {
    const mockParams = { locale: 'en', method: undefined };
    const props: PageProps = { params: Promise.resolve(mockParams) };

    mockedIsValidMethod.mockReturnValue(false);

    try {
      await MethodPage(props);
    } catch {}

    expect(mockedIsValidMethod).toHaveBeenCalledWith('');
    expect(mockedNotFound).toHaveBeenCalled();
  });

  it('should call notFound when method is null', async () => {
    const mockParams = { locale: 'en', method: undefined };
    const props: PageProps = { params: Promise.resolve(mockParams) };

    mockedIsValidMethod.mockReturnValue(false);
    try {
      await MethodPage(props);
    } catch {}
    expect(mockedIsValidMethod).toHaveBeenCalledWith('');
    expect(mockedNotFound).toHaveBeenCalled();
  });

  it('should call notFound when method is invalid', async () => {
    const mockParams = { locale: 'en', method: 'invalid' };
    const props: PageProps = { params: Promise.resolve(mockParams) };
    mockedIsValidMethod.mockReturnValue(false);

    try {
      await MethodPage(props);
    } catch {}
    expect(mockedIsValidMethod).toHaveBeenCalledWith('INVALID');
    expect(mockedNotFound).toHaveBeenCalled();
  });

  it('should handle empty string method', async () => {
    const mockParams = { locale: 'en', method: '' };
    const props: PageProps = { params: Promise.resolve(mockParams) };
    mockedIsValidMethod.mockReturnValue(false);
    try {
      await MethodPage(props);
    } catch {}
    expect(mockedIsValidMethod).toHaveBeenCalledWith('');
    expect(mockedNotFound).toHaveBeenCalled();
  });
});
