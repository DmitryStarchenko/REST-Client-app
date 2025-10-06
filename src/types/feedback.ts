export type FeedbackTopic =
  | 'bug-report'
  | 'feature-request'
  | 'how-to-question'
  | 'account-issue'
  | 'business-inquiry'
  | 'other';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface FeedbackFormData {
  email: string;
  topic: FeedbackTopic;
  description: string;
  priority: PriorityLevel;
}

export interface FeedbackSubmission extends Omit<FeedbackFormData, 'attachments'> {
  id: string;
  created_at: string;
  user_id?: string;
  status: 'pending' | 'in-progress' | 'resolved';
}
