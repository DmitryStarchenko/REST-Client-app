'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';

import { DeleteButtonProps } from '@/components/client/types';
import TooltipButton from '@/components/shared/TooltipButton/TooltipButton';
import { ReadonlyFC } from '@/types';

import styles from './HeadersBlock.module.css';

const DeleteButton: ReadonlyFC<DeleteButtonProps> = ({ onRemove, tooltipText, className }) => {
  const handleClick = (event: React.MouseEvent): void => {
    event.preventDefault();
    onRemove();
  };
  const buttonClass = `${styles.deleteButton} ${className || ''}`.trim();

  return (
    <TooltipButton
      tooltipText={tooltipText}
      onClick={handleClick}
      size="small"
      className={buttonClass}
    >
      <DeleteIcon fontSize="small" />
    </TooltipButton>
  );
};

export default DeleteButton;
