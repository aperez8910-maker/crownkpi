-- alert_history: remove public SELECT
DROP POLICY IF EXISTS "Anyone can view alert history" ON public.alert_history;
REVOKE SELECT ON public.alert_history FROM anon, authenticated;

-- cron_job_runs: remove public SELECT and UPDATE access
DROP POLICY IF EXISTS "Anyone can view cron job runs" ON public.cron_job_runs;
DROP POLICY IF EXISTS "Service can update cron job runs" ON public.cron_job_runs;
REVOKE SELECT, UPDATE ON public.cron_job_runs FROM anon, authenticated;

-- competitor_subscriptions: remove permissive SELECT and UPDATE policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.competitor_subscriptions;
DROP POLICY IF EXISTS "Users can update their subscriptions" ON public.competitor_subscriptions;
REVOKE SELECT, UPDATE ON public.competitor_subscriptions FROM anon, authenticated;

-- Secure RPCs scoped by email (caller must know the email)
CREATE OR REPLACE FUNCTION public.get_subscriptions_by_email(_email text)
RETURNS SETOF public.competitor_subscriptions
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.competitor_subscriptions
  WHERE email = lower(trim(_email)) AND is_active = true;
$$;

CREATE OR REPLACE FUNCTION public.deactivate_subscription(_email text, _competitor_url text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.competitor_subscriptions
  SET is_active = false, updated_at = now()
  WHERE email = lower(trim(_email)) AND competitor_url = _competitor_url;
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.get_subscriptions_by_email(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.deactivate_subscription(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_subscriptions_by_email(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.deactivate_subscription(text, text) TO anon, authenticated;