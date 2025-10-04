import { TextField, Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useState, useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';
import { ReadonlyFC } from '@/types';
import { FeedbackFormData } from '@/types/feedback';

import styles from './Email.module.css';

interface Props {
  handleInputChange: (
    field: keyof FeedbackFormData,
  ) => (event: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => void;
}

const InputEmail: ReadonlyFC<Props> = ({ handleInputChange }: Props) => {
  const translationEmail = useTranslations('Feedback');
  const [email, setEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEmail = async (): Promise<void> => {
      try {
        const { data: user } = await supabaseClient.auth.getUser();
        setEmail(user.user?.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      } finally {
        setLoading(false);
      }
    };

    getEmail();
  }, []);

  if (loading) {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {translationEmail('EmailLoad')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {email ? (
        <Box>
          <Typography>Email</Typography>
          <Typography className={styles.email}>{email}</Typography>
        </Box>
      ) : (
        <>
          <Typography>Email</Typography>
          <TextField
            fullWidth
            name="email"
            placeholder={translationEmail('EmailPlaceholder')}
            onChange={handleInputChange('email')}
            required
            variant="outlined"
            size="small"
          />
        </>
      )}
    </Box>
  );
};

export default InputEmail;
