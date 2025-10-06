import { HttpMethod, MethodStyle } from '@/types';

export const METHOD_STYLES: Record<HttpMethod, MethodStyle> = {
  GET: {
    backgroundColor: 'var(--mui-palette-success-dark)',
    color: 'var(--mui-palette-success-light)',
    borderColor: 'var(--mui-palette-success-main)',
  },
  POST: {
    backgroundColor: 'var(--mui-palette-info-dark)',
    color: 'var(--mui-palette-info-light)',
    borderColor: 'var(--mui-palette-info-main)',
  },
  PUT: {
    backgroundColor: 'var(--mui-palette-warning-dark)',
    color: 'var(--mui-palette-warning-light)',
    borderColor: 'var(--mui-palette-warning-main)',
  },
  PATCH: {
    backgroundColor: 'var(--mui-palette-secondary-dark)',
    color: 'var(--mui-palette-secondary-light)',
    borderColor: 'var(--mui-palette-secondary-main)',
  },
  DELETE: {
    backgroundColor: 'var(--mui-palette-error-dark)',
    color: 'var(--mui-palette-error-light)',
    borderColor: 'var(--mui-palette-error-main)',
  },
  HEAD: {
    backgroundColor: 'var(--mui-palette-primary-dark)',
    color: 'var(--mui-palette-primary-light)',
    borderColor: 'var(--mui-palette-primary-main)',
  },
  OPTIONS: {
    backgroundColor: 'var(--mui-palette-grey-600)',
    color: 'var(--mui-palette-primary)',
    borderColor: 'var(--mui-palette-grey-500)',
  },
};
