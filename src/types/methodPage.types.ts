export interface PageProps {
  params: Promise<{ locale: string; method?: string; params?: string[] }>;
}
