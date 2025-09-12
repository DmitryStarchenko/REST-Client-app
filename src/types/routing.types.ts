export interface BuildRestPathInput {
  method: string;
  url: string;
  body?: string;
  headers?: Record<string, string>;
}

export interface ParseRestPathResult {
  path: string;
  method: string;
  urlB64: string;
  bodyB64: string | undefined;
  query: string;
}
