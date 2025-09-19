'use client';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Tab, Tabs, IconButton, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { TopTabsBlockProps } from '@/types';
import { uid } from '@/utils';

import BodyBlock from './Body';
import CodeGenSection from './Codegen';
import HeadersBlock from './Headers';

const TopSection: React.FC<TopTabsBlockProps> = ({
  headers,
  setHeaders,
  bodyText,
  setBodyText,
  method,
  url,
}) => {
  const t = useTranslations('TopSection');
  const [topTab, setTopTab] = useState(0);
  const [codeLang, setCodeLang] = useState<string>('curl');
  const [open, setOpen] = useState(true);

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={() => setOpen((prev) => !prev)} size="small">
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <Tabs
          value={topTab}
          onChange={(_, newTab) => setTopTab(newTab)}
          sx={{ borderBottom: 1, borderColor: 'divider', flexGrow: 1 }}
        >
          <Tab label={t('Request Headers')} />
          <Tab label={t('Request Body')} />
          <Tab label={t('Codegen')} />
        </Tabs>
      </Stack>
      {open && (
        <Box>
          {topTab === 0 && (
            <HeadersBlock
              headers={headers.length ? headers : [{ key: '', value: '', id: uid() }]}
              setHeaders={setHeaders}
            />
          )}
          {topTab === 1 && <BodyBlock bodyText={bodyText} setBodyText={setBodyText} />}
          {topTab === 2 && (
            <CodeGenSection
              method={method}
              url={url}
              headers={headers}
              body={bodyText}
              codeLang={codeLang}
              setCodeLang={setCodeLang}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default TopSection;
