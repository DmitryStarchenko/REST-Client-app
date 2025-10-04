import { FormControl, Select, MenuItem, SelectChangeEvent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';

import { topicOptions } from '@/constants/feedback';
import { ReadonlyFC } from '@/types';
import { FeedbackFormData } from '@/types/feedback';

interface Props {
  handleInputChange: (
    field: keyof FeedbackFormData,
  ) => (
    event:
      | ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>
      | SelectChangeEvent<string>,
  ) => void;
  formData: FeedbackFormData;
}

const Topic: ReadonlyFC<Props> = ({ handleInputChange, formData }: Props) => {
  const translationTopic = useTranslations('Feedback');

  return (
    <FormControl fullWidth required>
      <Typography>{translationTopic('Topic')}</Typography>
      <Select name="topic" value={formData.topic} onChange={handleInputChange('topic')}>
        {topicOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {translationTopic(option.label)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Topic;
