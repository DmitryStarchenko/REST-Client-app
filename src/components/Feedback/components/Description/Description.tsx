import { TextField, Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';

import { ReadonlyFC } from '@/types';
import { FeedbackFormData } from '@/types/feedback';

interface Props {
  handleInputChange: (
    field: keyof FeedbackFormData,
  ) => (event: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => void;
  formData: FeedbackFormData;
}

const Description: ReadonlyFC<Props> = ({ handleInputChange, formData }: Props) => {
  const translationDesc = useTranslations('Feedback');

  return (
    <Box>
      <Typography>{translationDesc('Description')}</Typography>
      <TextField
        id="description"
        name="description"
        value={formData.description}
        onChange={handleInputChange('description')}
        placeholder={translationDesc('DescPlaceholder')}
        required
        fullWidth
        multiline
        rows={4}
        variant="outlined"
      />
    </Box>
  );
};

export default Description;
