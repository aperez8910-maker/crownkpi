-- Create table for storing website analysis reports
CREATE TABLE public.analysis_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  hostname TEXT NOT NULL,
  seo_score INTEGER NOT NULL,
  traffic_estimate TEXT,
  top_keywords TEXT[],
  strengths TEXT[],
  weaknesses TEXT[],
  marketing_channels JSONB,
  competitor_insights TEXT,
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view reports (public dashboard)
CREATE POLICY "Anyone can view reports"
ON public.analysis_reports
FOR SELECT
USING (true);

-- Allow anyone to insert reports (no auth required for this app)
CREATE POLICY "Anyone can create reports"
ON public.analysis_reports
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_analysis_reports_hostname ON public.analysis_reports(hostname);
CREATE INDEX idx_analysis_reports_created_at ON public.analysis_reports(created_at DESC);