import { Button as MUIButton } from '@mui/material';

type ButtonProps = {
  onClick: () => void;
  label: string;
};

export const Button = ({ onClick, label }: ButtonProps) => (
  <MUIButton variant="contained" color="primary" onClick={onClick}>
    {label}
  </MUIButton>
);
