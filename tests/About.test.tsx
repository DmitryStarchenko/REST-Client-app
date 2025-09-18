import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import About from '../src/components/layout/Main/components/About/About';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('./About.module.css', () => ({
  about: 'about',
  container: 'container',
  project: 'project',
  logoProject: 'logoProject',
  rs: 'rs',
  logoRS: 'logoRS',
  authors: 'authors',
  logoAuthors: 'logoAuthors',
  author: 'author',
  leadContainer: 'leadContainer',
  lead: 'lead',
}));

type MockFunction = ReturnType<typeof vi.fn>;
const mockUseTranslations = useTranslations as MockFunction;

describe('About Component', () => {
  const mockT = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTranslations.mockReturnValue(mockT);
  });

  it('should render all translated text sections', () => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        about: 'About Us',
        project1: 'Project description 1',
        project2: 'Project description 2',
        project3: 'Project description 3',
        rs: 'RS School information',
        author1Name: 'Author One',
        author1Description: 'Description of author one',
        author2Name: 'Author Two',
        author2Description: 'Description of author two',
        author3Name: 'Author Three',
        author3Description: 'Description of author three',
      };
      return translations[key] || key;
    });

    render(<About />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('About');
    expect(screen.getByText('Project description 1')).toBeInTheDocument();
    expect(screen.getByText('Project description 2')).toBeInTheDocument();
    expect(screen.getByText('Project description 3')).toBeInTheDocument();
    expect(screen.getByText('RS School information')).toBeInTheDocument();
    expect(screen.getByText('Author One')).toBeInTheDocument();
    expect(screen.getByText('Description of author one')).toBeInTheDocument();
    expect(screen.getByText('Author Two')).toBeInTheDocument();
    expect(screen.getByText('Description of author two')).toBeInTheDocument();
    expect(screen.getByText('Author Three')).toBeInTheDocument();
    expect(screen.getByText('Description of author three')).toBeInTheDocument();
  });

  it('should call useTranslations with correct namespace', () => {
    render(<About />);

    expect(mockUseTranslations).toHaveBeenCalledWith('About');
  });

  it('should handle missing translations gracefully', () => {
    mockT.mockImplementation((key: string) => key);

    render(<About />);

    expect(screen.getByText('about')).toBeInTheDocument();
    expect(screen.getByText('project1')).toBeInTheDocument();
    expect(screen.getByText('author1Name')).toBeInTheDocument();
  });
});
