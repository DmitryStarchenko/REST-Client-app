import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  InputProps,
} from '@mui/material';
import { useState } from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

interface PasswordInputProps extends InputProps {
  label: string;
}

const PasswordInput: ReadonlyFC<PasswordInputProps> = ({ label, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="standard">
      <InputLabel htmlFor="standard-adornment-password">{label}</InputLabel>
      <Input
        id="standard-adornment-password"
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? 'hide the password' : 'display the password'}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        {...props}
      />
    </FormControl>
  );
};

export default PasswordInput;
