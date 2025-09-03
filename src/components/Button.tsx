'use client';
import { Button as MUIButton } from '@mui/material';
import { FC } from 'react';

interface ButtonProps {
  onClick: () => void;
  label: string;
}

const Button: FC<ButtonProps> = ({ onClick, label }) => (
  <MUIButton variant="contained" color="primary" onClick={onClick}>
    {label}
  </MUIButton>
);

export default Button;
