import { FormControl, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';

import { priorityOptions } from '@/constants/feedback';
import { ReadonlyFC } from '@/types';
import { FeedbackFormData } from '@/types/feedback';

interface Props {
  handleInputChange: (
    field: keyof FeedbackFormData,
  ) => (event: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => void;
  formData: FeedbackFormData;
}

const Priority: ReadonlyFC<Props> = ({ handleInputChange, formData }: Props) => {
  const translationPriority = useTranslations('Feedback');

  return (
    <FormControl fullWidth>
      <Typography>{translationPriority('Priority')}</Typography>
      <RadioGroup
        name="priority"
        value={formData.priority}
        onChange={handleInputChange('priority')}
        row
        sx={{ gap: 2 }}
      >
        {priorityOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={translationPriority(option.label)}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default Priority;
