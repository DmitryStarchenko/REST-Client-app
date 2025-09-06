export interface BuildRestPathOptions {
  method?: string;
  url?: string;
  body?: string;
  headers?: Record<string, string>;
}

export interface BuildRestPathResult {
  path: string;
}

export interface ParseRestPathParams {
  method?: string;
  url?: string;
  body?: string;
  searchParams?: URLSearchParams | null;
}

export interface ParseRestPathResult {
  method: string;
  url: string;
  body: string;
  headers: Record<string, string>;
}
