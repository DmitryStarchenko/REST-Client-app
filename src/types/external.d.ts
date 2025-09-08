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

declare module 'postman-code-generators' {
  export interface PostmanLanguage {
    key: string;
    label: string;
    syntaxMode?: string;
    variants?: Array<{ key: string; label: string }>;
  }

  export interface PostmanRequest {
    method: string;
    url: string;
    headers?: Array<{ key: string; value: string }>;
    body?: unknown;
  }

  export function getLanguageList(): PostmanLanguage[];

  export function convert(
    language: string,
    variant: string,
    request: PostmanRequest,
    options: Record<string, unknown>,
    callback: (err: Error | null, snippet: string) => void,
  ): void;

  const _default: {
    getLanguageList: typeof getLanguageList;
    convert: typeof convert;
  };

  export default _default;
}
