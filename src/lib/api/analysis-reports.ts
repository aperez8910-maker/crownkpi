import { supabase } from '@/integrations/supabase/client';
import { WebsiteAnalysis } from './website-analysis';

export interface SavedReport {
  id: string;
  url: string;
  hostname: string;
  seo_score: number;
  traffic_estimate: string | null;
  top_keywords: string[] | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  marketing_channels: {
    organic: number;
    paid: number;
    social: number;
    direct: number;
    referral: number;
  } | null;
  competitor_insights: string | null;
  recommendations: string[] | null;
  created_at: string;
}

export async function saveAnalysisReport(analysis: WebsiteAnalysis): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const hostname = new URL(analysis.url).hostname;
    
    const { data, error } = await supabase
      .from('analysis_reports')
      .insert({
        url: analysis.url,
        hostname,
        seo_score: analysis.seoScore,
        traffic_estimate: analysis.trafficEstimate,
        top_keywords: analysis.topKeywords,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        marketing_channels: analysis.marketingChannels,
        competitor_insights: analysis.competitorInsights,
        recommendations: analysis.recommendations,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving report:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error saving report:', error);
    return { success: false, error: 'Failed to save report' };
  }
}

export async function getRecentReports(limit = 10): Promise<{ success: boolean; reports?: SavedReport[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('analysis_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching reports:', error);
      return { success: false, error: error.message };
    }

    return { success: true, reports: data as SavedReport[] };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { success: false, error: 'Failed to fetch reports' };
  }
}

export async function getReportById(id: string): Promise<{ success: boolean; report?: SavedReport; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('analysis_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching report:', error);
      return { success: false, error: error.message };
    }

    return { success: true, report: data as SavedReport };
  } catch (error) {
    console.error('Error fetching report:', error);
    return { success: false, error: 'Failed to fetch report' };
  }
}
