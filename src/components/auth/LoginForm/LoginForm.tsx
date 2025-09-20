'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormHelperText, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import PasswordInput from '@/components/shared/PasswordInput/PasswordInput';
import { useRouter } from '@/i18n/navigation';
import supabaseClient from '@/lib/supabase/client';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './LoginForm.module.css';
import { LoginFormFields, loginSchema } from './loginSchema';

const LoginForm: ReadonlyFC = () => {
  const translationAuth = useTranslations('Auth');
  const router = useRouter();

  const { handleSubmit, register, setError, formState } = useForm<LoginFormFields>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
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
      <h1>{translationAuth('login')}</h1>
      <TextField
        id="email"
        label={translationAuth('email')}
        variant="standard"
        error={Boolean(formState.errors.email)}
        helperText={
          formState.errors.email?.message && translationAuth(formState.errors.email?.message)
        }
        type="email"
        {...register('email')}
      />

      <PasswordInput
        label={translationAuth('password')}
        fullWidth
        {...register('password')}
        error={Boolean(formState.errors.password)}
        helperText={
          formState.errors.password?.message && translationAuth(formState.errors.password?.message)
        }
      />
      {formState.errors.root && (
        <FormHelperText error={true}>
          {translationAuth(formState.errors.root.message ?? '')}
        </FormHelperText>
      )}
      <Button type="submit" loading={formState.isSubmitting}>
        {translationAuth('Submit')}
      </Button>
    </form>
  );
};

export default LoginForm;
