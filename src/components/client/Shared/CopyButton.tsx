'use client';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Snackbar, Tooltip } from '@mui/material';
import React, { useState } from 'react';

import { CopyButtonProps } from '@/types';

export const CopyButton: React.FC<CopyButtonProps> = ({ getValue }) => {
  const [open, setOpen] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      const text = getValue();
      if (!text) return;
      await navigator.clipboard.writeText(text);
      setOpen(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <Tooltip title="Copy content" placement="left">
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'background.paper',
            opacity: 0.4,
            '&:hover': { bgcolor: 'action.hover', opacity: 1 },
            zIndex: 2,
          }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message="Copied!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};
