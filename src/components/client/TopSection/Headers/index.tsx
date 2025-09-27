'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Box, IconButton, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import WithVariables from '@/components/shared/WithVariables';
import { HeadersBlockProps, ReadonlyFC } from '@/types';
import { uid } from '@/utils';

import styles from '../TopSection.module.css';

const HeadersBlock: ReadonlyFC<HeadersBlockProps> = ({ headers, setHeaders }) => {
  const t = useTranslations('HeadersBlock');

  const handleChange = (id: string, key: string, value: string): void => {
    const newHeaders = headers.map((h) => (h.id === id ? { ...h, key, value } : h));

    const last = newHeaders[newHeaders.length - 1];
    if (last.key !== '' || last.value !== '') {
      newHeaders.push({ key: '', value: '', id: uid() });
    }
    setHeaders(newHeaders);
  };

  const handleRemove = (id: string): void => {
    if (headers.length <= 1) return;
    const newHeaders = headers.filter((h) => h.id !== id);
    setHeaders(newHeaders);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBox}>
        <Stack spacing={1} sx={{ width: '100%', minHeight: '348px' }}>
          {headers.map((h, index) => {
            const isLast = index === headers.length - 1;
            const isEmpty = h.key === '' && h.value === '';
            const incomplete = (h.key !== '' && h.value === '') || (h.key === '' && h.value !== '');

            return (
              <Box
                key={h.id}
                sx={{
                  position: 'relative',
                  '&:hover .delete-btn': { opacity: 0.5 },
                  gap: '2',
                }}
              >
                <Stack direction="row" spacing={1}>
                  <WithVariables
                    value={h.key}
                    onChange={(newKey) => handleChange(h.id, newKey, h.value)}
                  >
                    <TextField
                      fullWidth
                      placeholder={t(`Key`)}
                      size="small"
                      sx={{ flex: 1 }}
                      slotProps={{
                        input: {
                          endAdornment: incomplete ? (
                            <InputAdornment position="end">
                              <Tooltip arrow placement="right" title={t(`Tooltip`)}>
                                <InfoOutlined
                                  color="warning"
                                  fontSize="small"
                                  opacity="0.6"
                                  data-testid="info-icon"
                                />
                              </Tooltip>
                            </InputAdornment>
                          ) : null,
                        },
                      }}
                    />
                  </WithVariables>
                  <WithVariables
                    value={h.value}
                    onChange={(newValue) => handleChange(h.id, h.key, newValue)}
                  >
                    <TextField fullWidth placeholder={t(`Value`)} size="small" sx={{ flex: 2 }} />
                  </WithVariables>
                </Stack>

                {(!isLast || !isEmpty) && (
                  <Tooltip title={t(`Delete`)}>
                    <IconButton
                      className="delete-btn"
                      onClick={() => handleRemove(h.id)}
                      size="small"
                      sx={{
                        position: 'absolute',
                        right: +5,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        opacity: 0,
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            );
          })}
        </Stack>
      </div>
    </div>
  );
};

export default HeadersBlock;
