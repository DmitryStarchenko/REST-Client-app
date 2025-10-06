import supabaseClient from '@/lib/supabase/client';
import { FeedbackSubmission, FeedbackFormData } from '@/types/feedback';

export const service = async (formData: FeedbackFormData): Promise<FeedbackSubmission> => {
  const { data: user } = await supabaseClient.auth.getUser();

  const submissionData = {
    email: user.user?.email ? user.user?.email : formData.email,
    topic: formData.topic,
    description: formData.description,
    priority: formData.priority,
    user_id: user.user?.id,
    status: 'pending' as const,
  };

  const { data, error } = await supabaseClient
    .from('feedback')
    .insert([submissionData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to submit feedback: ${error.message}`);
  }

  return data;
};
