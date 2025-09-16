declare module 'httpsnippet' {
  export interface HTTPSnippetInput {
    method: string;
    url: string;
    httpVersion?: string;
    headers?: Array<{ name: string; value: string }>;
    postData?: { mimeType: string; text: string };
  }

  export default class HTTPSnippet {
    constructor(input: HTTPSnippetInput);
    convert(target: string, client?: string, options?: Record<string, unknown>): string | null;
  }
}
