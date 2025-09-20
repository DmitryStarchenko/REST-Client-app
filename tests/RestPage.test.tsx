import { notFound } from 'next/navigation';
import { describe, it, vi, expect } from 'vitest';

import type { ReadonlyFC } from '@/types/readonly.types';

import CatchAllPage from '../src/app/[locale]/[...rest]/page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('notFound called');
  }),
}));

describe('CatchAllPage', () => {
  it('should call notFound function when component is rendered', () => {
    expect(notFound).not.toHaveBeenCalled();
    expect(() => CatchAllPage({})).toThrow('notFound called');
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('should have correct component type', () => {
    const component: ReadonlyFC = CatchAllPage;
    expect(typeof component).toBe('function');
  });
});
