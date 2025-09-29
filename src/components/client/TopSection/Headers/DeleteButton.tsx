'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';

import TooltipButton from '@/components/shared/TooltipButton/TooltipButton';
import { DeleteButtonProps, ReadonlyFC } from '@/types';

const DeleteButton: ReadonlyFC<DeleteButtonProps> = ({ onRemove, tooltipText }) => {
  const handleClick = (event: React.MouseEvent): void => {
    event.preventDefault();
    onRemove();
  };

  return (
    <TooltipButton
      tooltipText={tooltipText}
      className="delete-btn"
      onClick={handleClick}
      size="small"
      sx={{
        position: 'absolute',
        right: 5,
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: 0,
        zIndex: 10,
        pointerEvents: 'auto',
      }}
    >
      <DeleteIcon fontSize="small" />
    </TooltipButton>
  );
};

export default DeleteButton;
