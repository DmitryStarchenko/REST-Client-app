import HTTPSnippet from 'httpsnippet';

import { CodeGenOutputs } from '@/types';

export function generateOutputs(sn: HTTPSnippet): CodeGenOutputs {
  return {
    curl: sn.convert('shell', 'curl') ?? '',
    httpie: sn.convert('shell', 'httpie') ?? '',
    wget: sn.convert('shell', 'wget') ?? '',
    fetch: sn.convert('javascript', 'fetch') ?? '',
    axios: sn.convert('javascript', 'axios') ?? '',
    jquery: sn.convert('javascript', 'jquery') ?? '',
    xhr: sn.convert('javascript', 'xhr') ?? '',
    node_native: sn.convert('node', 'native') ?? '',
    node_request: sn.convert('node', 'request') ?? '',
    node_unirest: sn.convert('node', 'unirest') ?? '',
    python: sn.convert('python', 'python-requests') ?? '',
    java_okhttp: sn.convert('java', 'okhttp') ?? '',
    java_unirest: sn.convert('java', 'unirest') ?? '',
    csharp_httpclient: sn.convert('csharp', 'httpclient') ?? '',
    csharp_restsharp: sn.convert('csharp', 'restsharp') ?? '',
    go: sn.convert('go', 'native') ?? '',
    php_curl: sn.convert('php', 'curl') ?? '',
    php_guzzle: sn.convert('php', 'guzzle') ?? '',
    ruby: sn.convert('ruby', 'net::http') ?? '',
    swift: sn.convert('swift', 'nsurlsession') ?? '',
  };
}
