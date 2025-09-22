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

import styles from './RegForm.module.css';
import { RegFormFields, regSchema } from './regSchema';

const RegForm: ReadonlyFC = () => {
  const translationAuth = useTranslations('Auth');

  const router = useRouter();

  const { handleSubmit, register, setError, formState } = useForm<RegFormFields>({
    mode: 'onChange',
    resolver: zodResolver(regSchema),
  });

  const onSubmit: SubmitHandler<RegFormFields> = async (data) => {
    try {
      const { error } = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
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
      <h1>{translationAuth('Registration')}</h1>
      <TextField
        id="email"
        label={translationAuth('email')}
        variant="standard"
        {...register('email')}
        error={Boolean(formState.errors.email)}
        helperText={
          formState.errors.email?.message && translationAuth(formState.errors.email?.message)
        }
      />

      <PasswordInput
        id="password"
        label={translationAuth('password')}
        fullWidth
        {...register('password')}
        error={Boolean(formState.errors.password)}
        helperText={
          formState.errors.password?.message && translationAuth(formState.errors.password?.message)
        }
      />
      <PasswordInput
        id="confirmPassword"
        label={translationAuth('confirm password')}
        fullWidth
        {...register('confirmPassword')}
        error={Boolean(formState.errors.confirmPassword)}
        helperText={
          formState.errors.confirmPassword?.message &&
          translationAuth(formState.errors.confirmPassword?.message)
        }
      />
      {formState.errors.root && (
        <FormHelperText error={true}>{formState.errors.root.message}</FormHelperText>
      )}
      <Button type="submit" loading={formState.isSubmitting}>
        {translationAuth('Submit')}
      </Button>
    </form>
  );
};

export default RegForm;
