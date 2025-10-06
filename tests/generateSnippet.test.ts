import type HTTPSnippet from 'httpsnippet';
import { describe, it, expect, vi } from 'vitest';

import { generateSnippet } from '@/utils/';

describe('generateSnippet', () => {
  it('calls convert for all targets and returns correct outputs', () => {
    const mockSn: Partial<HTTPSnippet> = {
      convert: vi.fn().mockImplementation((platform, client) => `${platform}-${client}`),
    };

    const result = generateSnippet(mockSn as HTTPSnippet);

    expect(mockSn.convert).toHaveBeenCalledWith('shell', 'curl');
    expect(mockSn.convert).toHaveBeenCalledWith('shell', 'httpie');
    expect(mockSn.convert).toHaveBeenCalledWith('shell', 'wget');
    expect(mockSn.convert).toHaveBeenCalledWith('javascript', 'fetch');
    expect(mockSn.convert).toHaveBeenCalledWith('javascript', 'axios');
    expect(mockSn.convert).toHaveBeenCalledWith('javascript', 'jquery');
    expect(mockSn.convert).toHaveBeenCalledWith('javascript', 'xhr');
    expect(mockSn.convert).toHaveBeenCalledWith('node', 'native');
    expect(mockSn.convert).toHaveBeenCalledWith('node', 'request');
    expect(mockSn.convert).toHaveBeenCalledWith('node', 'unirest');
    expect(mockSn.convert).toHaveBeenCalledWith('python', 'python-requests');
    expect(mockSn.convert).toHaveBeenCalledWith('java', 'okhttp');
    expect(mockSn.convert).toHaveBeenCalledWith('java', 'unirest');
    expect(mockSn.convert).toHaveBeenCalledWith('csharp', 'httpclient');
    expect(mockSn.convert).toHaveBeenCalledWith('csharp', 'restsharp');
    expect(mockSn.convert).toHaveBeenCalledWith('go', 'native');
    expect(mockSn.convert).toHaveBeenCalledWith('php', 'curl');
    expect(mockSn.convert).toHaveBeenCalledWith('php', 'guzzle');
    expect(mockSn.convert).toHaveBeenCalledWith('ruby', 'net::http');
    expect(mockSn.convert).toHaveBeenCalledWith('swift', 'nsurlsession');

    expect(result).toEqual({
      curl: 'shell-curl',
      httpie: 'shell-httpie',
      wget: 'shell-wget',
      fetch: 'javascript-fetch',
      axios: 'javascript-axios',
      jquery: 'javascript-jquery',
      xhr: 'javascript-xhr',
      node_native: 'node-native',
      node_request: 'node-request',
      node_unirest: 'node-unirest',
      python: 'python-python-requests',
      java_okhttp: 'java-okhttp',
      java_unirest: 'java-unirest',
      csharp_httpclient: 'csharp-httpclient',
      csharp_restsharp: 'csharp-restsharp',
      go: 'go-native',
      php_curl: 'php-curl',
      php_guzzle: 'php-guzzle',
      ruby: 'ruby-net::http',
      swift: 'swift-nsurlsession',
    });
  });

  it('returns empty string if convert returns null', () => {
    const mockSn: Partial<HTTPSnippet> = {
      convert: vi.fn().mockReturnValue(null),
    };

    const result = generateSnippet(mockSn as HTTPSnippet);

    Object.values(result).forEach((value) => {
      expect(value).toBe('');
    });
  });
});
