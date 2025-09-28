'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';

import TooltipButton from '@/components/shared/TooltipButton/TooltipButton';
import { ReadonlyFC } from '@/types';

interface DeleteButtonProps {
  onRemove: () => void;
  tooltipText: string;
}

export const DeleteButton: ReadonlyFC<DeleteButtonProps> = ({ onRemove, tooltipText }) => {
  const handleClick = (e: React.MouseEvent): void => {
    e.preventDefault();
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
