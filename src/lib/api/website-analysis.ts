import { supabase } from '@/integrations/supabase/client';

export interface WebsiteAnalysis {
  url: string;
  seoScore: number;
  trafficEstimate: string;
  topKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  marketingChannels: {
    organic: number;
    paid: number;
    social: number;
    direct: number;
    referral: number;
  };
  competitorInsights: string;
  recommendations: string[];
  scrapedAt: Date;
}

export async function scrapeWebsite(url: string): Promise<{ success: boolean; data?: any; markdown?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke('scrape-website', {
    body: { url }
  });

  if (error) {
    console.error('Scrape error:', error);
    return { success: false, error: error.message };
  }

  return data;
}

export async function analyzeWebsite(url: string, websiteContent: string): Promise<{ success: boolean; analysis?: WebsiteAnalysis; error?: string }> {
  const { data, error } = await supabase.functions.invoke('analyze-website', {
    body: { url, websiteContent }
  });

  if (error) {
    console.error('Analysis error:', error);
    return { success: false, error: error.message };
  }

  if (!data.success) {
    return { success: false, error: data.error };
  }

  return {
    success: true,
    analysis: {
      url,
      ...data.analysis,
      scrapedAt: new Date()
    }
  };
}

export async function fullWebsiteAnalysis(url: string): Promise<{ success: boolean; analysis?: WebsiteAnalysis; error?: string }> {
  // First scrape the website
  const scrapeResult = await scrapeWebsite(url);
  
  console.log('Scrape result:', scrapeResult);
  
  // Firecrawl returns { success: true, data: { markdown, links, ... } }
  if (!scrapeResult.success) {
    return { success: false, error: scrapeResult.error || 'Failed to scrape website' };
  }

  // Handle both nested and flat response structures
  const content = scrapeResult.data?.markdown || scrapeResult.markdown || '';
  
  console.log('Extracted content length:', content.length);
  
  if (!content) {
    return { success: false, error: 'No content retrieved from website' };
  }

  // Then analyze with AI
  return analyzeWebsite(url, content);
}
