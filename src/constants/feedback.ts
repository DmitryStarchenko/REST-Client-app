import { FeedbackFormData, FeedbackTopic, PriorityLevel } from '@/types/feedback';

export const topicOptions: { value: FeedbackTopic; label: string }[] = [
  { value: 'bug-report', label: 'bugReport' },
  { value: 'feature-request', label: 'featureRequest' },
  { value: 'how-to-question', label: 'howToQuestion' },
  { value: 'account-issue', label: 'accountIssue' },
  { value: 'business-inquiry', label: 'businessInquiry' },
  { value: 'other', label: 'other' },
];

export const priorityOptions: { value: PriorityLevel; label: string }[] = [
  { value: 'low', label: 'low' },
  { value: 'medium', label: 'medium' },
  { value: 'high', label: 'high' },
  { value: 'critical', label: 'critical' },
];

export const initialFormData: FeedbackFormData = {
  email: '',
  topic: 'bug-report',
  description: '',
  priority: 'medium',
};
