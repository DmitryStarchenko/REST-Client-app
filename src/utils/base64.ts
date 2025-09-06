export const encodeBase64 = (input: string): string => {
  if (typeof window === 'undefined') {
    return Buffer.from(input, 'utf8').toString('base64');
  }
  return btoa(
    new TextEncoder().encode(input).reduce((acc, byte) => acc + String.fromCharCode(byte), ''),
  );
};

export const decodeBase64 = (input: string): string => {
  if (!input) {
    return '';
  }
  if (typeof window === 'undefined') {
    return Buffer.from(input, 'base64').toString('utf8');
  }
  try {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return atob(input);
  }
};
