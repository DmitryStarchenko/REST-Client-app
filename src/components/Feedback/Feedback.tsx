'use client';

import { Box, Typography, Button, Alert, Paper, Container, SelectChangeEvent } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

import { INITIAL_FORM_DATA } from '@/constants/feedback';
import { ReadonlyFC } from '@/types';
import { FeedbackFormData } from '@/types/feedback';

import Description from './components/Description/Description';
import Email from './components/Email/Email';
import Priority from './components/Priority/Priority';
import Topic from './components/Topic/Topic';
import styles from './Feedback.module.css';
import { service } from './services/service';

const Feedback: ReadonlyFC = () => {
  const [formData, setFormData] = useState<FeedbackFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const translationFeedback = useTranslations('Feedback');

  const handleInputChange = useCallback(
    (field: keyof FeedbackFormData) =>
      (
        event:
          | ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>
          | SelectChangeEvent<string>,
      ) => {
        setFormData((previous) => ({
          ...previous,
          [field]: event.target.value,
        }));
        setSubmitError('');
      },
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await service(formData);
      setSubmitSuccess(true);
      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : translationFeedback('ErrorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          className={styles.success}
          sx={{ backgroundColor: 'success.light', color: 'success.contrastText' }}
        >
          <Typography variant="h5" gutterBottom>
            {translationFeedback('submitSuccess1')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {translationFeedback('submitSuccess2')}
          </Typography>
          <Button variant="contained" onClick={() => setSubmitSuccess(false)} sx={{ mt: 2 }}>
            {translationFeedback('submitSuccess3')}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      <Paper className={styles.content}>
        <Typography className={styles.title} variant="h4">
          {translationFeedback('Title')}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} className={styles.form}>
          <Email handleInputChange={handleInputChange} />
          <Topic handleInputChange={handleInputChange} formData={formData} />
          <Description handleInputChange={handleInputChange} formData={formData} />
          <Priority handleInputChange={handleInputChange} formData={formData} />

          {submitError && (
            <Alert severity="error" className={styles.error}>
              {submitError}
            </Alert>
          )}

          <Button type="submit" variant="contained" disabled={isSubmitting} size="large">
            {isSubmitting ? (
              <Box gap={1}>{translationFeedback('ButtonLoad')}</Box>
            ) : (
              translationFeedback('Button')
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Feedback;
