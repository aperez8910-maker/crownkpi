import { supabase } from '@/integrations/supabase/client';

export interface CompetitorSubscription {
  id: string;
  email: string;
  competitor_url: string;
  last_seo_score: number | null;
  last_checked_at: string | null;
  is_active: boolean;
  created_at: string;
}

export async function subscribeToCompetitor(
  email: string, 
  competitorUrl: string, 
  initialScore?: number
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase
    .from('competitor_subscriptions')
    .insert({
      email,
      competitor_url: competitorUrl,
      last_seo_score: initialScore || null,
      last_checked_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Subscribe error:', error);
    if (error.code === '23505') {
      return { success: false, error: 'You are already subscribed to this competitor' };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function unsubscribeFromCompetitor(
  email: string,
  competitorUrl: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.rpc('deactivate_subscription', {
    _email: email,
    _competitor_url: competitorUrl,
  });

  if (error) {
    console.error('Unsubscribe error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getSubscriptions(email: string): Promise<CompetitorSubscription[]> {
  const { data, error } = await supabase.rpc('get_subscriptions_by_email', {
    _email: email,
  });

  if (error) {
    console.error('Fetch subscriptions error:', error);
    return [];
  }

  return (data || []) as CompetitorSubscription[];
}

export async function sendCompetitorAlert(
  email: string,
  competitorUrl: string,
  oldScore: number,
  newScore: number,
  changes?: string
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase.functions.invoke('send-competitor-alert', {
    body: { email, competitorUrl, oldScore, newScore, changes }
  });

  if (error) {
    console.error('Send alert error:', error);
    return { success: false, error: error.message };
  }

  return data;
}
