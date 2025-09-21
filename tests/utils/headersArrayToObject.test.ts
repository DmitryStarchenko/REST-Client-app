import { describe, it, expect } from 'vitest';

import type { Header } from '@/types';

import { headersArrayToObject } from './headersArrayToObject';

describe('headersArrayToObject', () => {
  it('converts an array of headers to an object', () => {
    const headers: Header[] = [
      { id: '1', key: 'Content-Type', value: 'application/json' },
      { id: '2', key: 'Authorization', value: 'Bearer token' },
      { id: '3', key: 'Accept', value: 'application/json' },
    ];

    const result = headersArrayToObject(headers);

    expect(result).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
      Accept: 'application/json',
    });
  });

  it('filters headers with empty keys or values', () => {
    const headers: Header[] = [
      { id: '1', key: 'Content-Type', value: 'application/json' },
      { id: '2', key: '', value: 'should-be-ignored' },
      { id: '3', key: 'Authorization', value: '' },
      { id: '4', key: '   ', value: 'should-be-ignored' },
      { id: '5', key: 'Accept', value: '   ' },
      { id: '6', key: 'User-Agent', value: 'Mozilla' },
    ];

    const result = headersArrayToObject(headers);

    expect(result).toEqual({
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla',
    });
  });

  it('processes an empty array', () => {
    const headers: Header[] = [];
    const result = headersArrayToObject(headers);

    expect(result).toEqual({});
  });

  it('processes array only with invalid headers', () => {
    const headers: Header[] = [
      { id: '1', key: '', value: 'value' },
      { id: '2', key: 'key', value: '' },
      { id: '3', key: '   ', value: 'value' },
      { id: '4', key: 'key', value: '   ' },
    ];

    const result = headersArrayToObject(headers);

    expect(result).toEqual({});
  });

  it('overwrites duplicate keys with the latest value', () => {
    const headers: Header[] = [
      { id: '1', key: 'Content-Type', value: 'application/xml' },
      { id: '2', key: 'Content-Type', value: 'application/json' },
      { id: '3', key: 'Authorization', value: 'Bearer first' },
      { id: '4', key: 'Authorization', value: 'Bearer second' },
    ];

    const result = headersArrayToObject(headers);

    expect(result).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer second',
    });
  });

  it('preserves key register', () => {
    const headers: Header[] = [
      { id: '1', key: 'content-type', value: 'application/json' },
      { id: '2', key: 'AUTHORIZATION', value: 'Bearer token' },
      { id: '3', key: 'Accept-Language', value: 'en-US' },
    ];

    const result = headersArrayToObject(headers);

    expect(result).toEqual({
      'content-type': 'application/json',
      AUTHORIZATION: 'Bearer token',
      'Accept-Language': 'en-US',
    });
  });

  it('handles special characters in keys and values', () => {
    const headers: Header[] = [
      { id: '1', key: 'X-Custom-Header', value: 'special@value.com' },
      { id: '2', key: 'Set-Cookie', value: 'session=abc123; HttpOnly; Secure' },
      { id: '3', key: 'If-Match', value: '"etag123"' },
    ];

    const result = headersArrayToObject(headers);

    expect(result).toEqual({
      'X-Custom-Header': 'special@value.com',
      'Set-Cookie': 'session=abc123; HttpOnly; Secure',
      'If-Match': '"etag123"',
    });
  });

  it('does not mutate the original array', () => {
    const originalHeaders: Header[] = [
      { id: '1', key: 'Content-Type', value: 'application/json' },
      { id: '2', key: '', value: 'should-be-ignored' },
    ];

    const headersCopy = [...originalHeaders];
    const result = headersArrayToObject(originalHeaders);

    expect(originalHeaders).toEqual(headersCopy);
    expect(result).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it('returns a new object each time it is called', () => {
    const headers: Header[] = [{ id: '1', key: 'Content-Type', value: 'application/json' }];

    const result1 = headersArrayToObject(headers);
    const result2 = headersArrayToObject(headers);

    expect(result1).toEqual(result2);
    expect(result1).not.toBe(result2);
  });
});
