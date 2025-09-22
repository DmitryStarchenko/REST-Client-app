import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import { Link } from '@/i18n';
import { createClient } from '@/lib/supabase/server';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './History.module.css';

const LayoutHistoryContent: ReadonlyFC = async () => {
  const translationHistory = await getTranslations('History');
  const translationMain = await getTranslations('Main');

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: history, error: dbError } = await supabase
      .from('request_history')
      .select('*')
      .eq('user_id', user?.id)
      .order('timestamp', { ascending: false });

    if (dbError) {
      throw new Error(dbError.message);
    }

    const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    if (!history || history.length === 0) {
      return (
        <main className={styles.main}>
          <Typography variant="h4">{translationHistory('title')}</Typography>
          <Container className={styles.notRequest}>
            <div className={styles.logoEmpty}></div>
            <Typography variant="h5">{translationHistory('text')}</Typography>
            <Link className={styles.navButton} href={'/client'}>
              {translationMain('client')}
            </Link>
          </Container>
        </main>
      );
    }

    return (
      <main className={styles.main}>
        <Typography variant="h4">{translationHistory('title')}</Typography>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>{translationHistory('timestamp')}</TableCell>
              <TableCell>{translationHistory('method')}</TableCell>
              <TableCell>{translationHistory('status')}</TableCell>
              <TableCell>{translationHistory('url')}</TableCell>
              <TableCell>{translationHistory('requestSize')}</TableCell>
              <TableCell>{translationHistory('responseSize')}</TableCell>
              <TableCell>{translationHistory('duration')}</TableCell>
              <TableCell>{translationHistory('error_text')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.timestamp)}</TableCell>
                <TableCell>{item.method}</TableCell>
                <TableCell>{item.response_status}</TableCell>
                <TableCell>
                  <Link href={item.path ?? ''}>{item.url}</Link>
                </TableCell>
                <TableCell>{item.request_size}</TableCell>
                <TableCell>{item.response_size}</TableCell>
                <TableCell>{item.duration_ms}</TableCell>
                <TableCell>{item.error_details ? item.error_details : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return (
      <main className={styles.main}>
        <Typography variant="h4">{translationHistory('title')}</Typography>
        <Typography color="error">
          {translationHistory('error')} {errorMessage}
        </Typography>
      </main>
    );
  }
};

export default LayoutHistoryContent;
