const VARIABLE_REGEX = /\{\{(\w+)\}\}/g;

export function replaceVariables(str: string, values: Record<string, string>): string {
  return str.replace(VARIABLE_REGEX, (_, key) => {
    return values[key] ?? `{{${key}}}`; // keep placeholder if no value found
  });
}
