-- Create table to track competitor subscriptions for email alerts
CREATE TABLE public.competitor_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  competitor_url TEXT NOT NULL,
  last_seo_score INTEGER,
  last_analysis_hash TEXT,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(email, competitor_url)
);

-- Enable RLS
ALTER TABLE public.competitor_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (public feature)
CREATE POLICY "Anyone can create subscriptions" 
ON public.competitor_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view their own subscriptions by email
CREATE POLICY "Users can view their own subscriptions" 
ON public.competitor_subscriptions 
FOR SELECT 
USING (true);

-- Allow updates for unsubscribing
CREATE POLICY "Users can update their subscriptions" 
ON public.competitor_subscriptions 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_competitor_subscriptions_updated_at
BEFORE UPDATE ON public.competitor_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();