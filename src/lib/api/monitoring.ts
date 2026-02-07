import { supabase } from '@/integrations/supabase/client';

export interface CronJobRun {
  id: string;
  job_name: string;
  started_at: string;
  completed_at: string | null;
  status: string;
  subscriptions_checked: number;
  alerts_sent: number;
  error_message: string | null;
  duration_seconds: number | null;
}

export interface AlertHistoryItem {
  id: string;
  subscription_id: string | null;
  email: string;
  competitor_url: string;
  old_score: number;
  new_score: number;
  score_change: number;
  changes_summary: string | null;
  sent_at: string;
  email_sent: boolean;
}

export interface SubscriptionWithLastCheck {
  id: string;
  email: string;
  competitor_url: string;
  last_seo_score: number | null;
  last_checked_at: string | null;
  is_active: boolean;
  created_at: string;
}

export async function getCronJobRuns(limit = 20): Promise<CronJobRun[]> {
  const { data, error } = await supabase
    .from('cron_job_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching cron job runs:', error);
    return [];
  }

  return (data || []) as CronJobRun[];
}

export async function getAlertHistory(limit = 50): Promise<AlertHistoryItem[]> {
  const { data, error } = await supabase
    .from('alert_history')
    .select('*')
    .order('sent_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching alert history:', error);
    return [];
  }

  return (data || []) as AlertHistoryItem[];
}

export async function getActiveSubscriptions(): Promise<SubscriptionWithLastCheck[]> {
  const { data, error } = await supabase
    .from('competitor_subscriptions')
    .select('*')
    .eq('is_active', true)
    .order('last_checked_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }

  return (data || []) as SubscriptionWithLastCheck[];
}

export async function triggerManualCheck(): Promise<{ success: boolean; error?: string; checked?: number; alerts?: number }> {
  const { data, error } = await supabase.functions.invoke('check-competitor-changes', {
    body: {}
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data;
}
