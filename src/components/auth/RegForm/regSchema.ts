import z from 'zod';

export const regSchema = z
  .object({
    email: z.email({ error: 'Enter valid email' }),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
    when(payload) {
      return regSchema.pick({ password: true, confirmPassword: true }).safeParse(payload.value)
        .success;
    },
  });

export type RegFormFields = z.infer<typeof regSchema>;
