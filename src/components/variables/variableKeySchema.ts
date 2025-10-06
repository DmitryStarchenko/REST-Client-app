import z from 'zod';

export const variableKeySchema = z
  .string()
  .min(1, 'Variable key is required')
  .refine((value) => !/\s/.test(value), { message: 'Spaces are not allowed' })
  .refine((value) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value), {
    message: 'Invalid key',
  });
