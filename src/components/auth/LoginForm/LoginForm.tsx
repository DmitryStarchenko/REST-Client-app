'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

import PasswordInput from '@/components/shared/PasswordInput/PasswordInput';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './LoginForm.module.css';
import { LoginFormFields, loginSchema } from './loginSchema';

const LoginForm: ReadonlyFC = () => {
  const router = useRouter();

  const { handleSubmit, register, setError, formState } = useForm<LoginFormFields>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push('/');
    } catch (error: unknown) {
      setError('root', {
        type: 'custom',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1>Login</h1>
      <TextField
        id="login"
        label="login"
        variant="standard"
        {...register('email')}
        error={Boolean(formState.errors.email)}
        helperText={formState.errors.email?.message}
      />

      <PasswordInput
        label="password"
        fullWidth
        {...register('password')}
        error={Boolean(formState.errors.password)}
        // helperText={formState.errors.password?.message}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default LoginForm;
