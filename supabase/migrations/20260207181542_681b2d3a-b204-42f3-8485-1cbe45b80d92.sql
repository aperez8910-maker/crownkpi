-- Create table to track cron job runs
CREATE TABLE public.cron_job_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_name TEXT NOT NULL DEFAULT 'daily-competitor-check',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'running',
  subscriptions_checked INTEGER DEFAULT 0,
  alerts_sent INTEGER DEFAULT 0,
  error_message TEXT,
  duration_seconds NUMERIC
);

-- Create table to track sent alerts
CREATE TABLE public.alert_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES public.competitor_subscriptions(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  competitor_url TEXT NOT NULL,
  old_score INTEGER NOT NULL,
  new_score INTEGER NOT NULL,
  score_change INTEGER NOT NULL,
  changes_summary TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_sent BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.cron_job_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_history ENABLE ROW LEVEL SECURITY;

-- Public read access for dashboard (no auth required for this demo)
CREATE POLICY "Anyone can view cron job runs" 
ON public.cron_job_runs FOR SELECT USING (true);

CREATE POLICY "Anyone can view alert history" 
ON public.alert_history FOR SELECT USING (true);

-- Service role can insert (from edge functions)
CREATE POLICY "Service can insert cron job runs" 
ON public.cron_job_runs FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update cron job runs" 
ON public.cron_job_runs FOR UPDATE USING (true);

CREATE POLICY "Service can insert alert history" 
ON public.alert_history FOR INSERT WITH CHECK (true);

-- Add index for faster queries
CREATE INDEX idx_cron_job_runs_started_at ON public.cron_job_runs(started_at DESC);
CREATE INDEX idx_alert_history_sent_at ON public.alert_history(sent_at DESC);