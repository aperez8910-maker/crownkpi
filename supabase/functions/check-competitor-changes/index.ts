import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface Subscription {
  id: string;
  email: string;
  competitor_url: string;
  last_seo_score: number | null;
  last_checked_at: string | null;
  is_active: boolean;
}

async function scrapeWebsite(url: string, firecrawlApiKey: string): Promise<{ success: boolean; content?: string; error?: string }> {
  let formattedUrl = url.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = `https://${formattedUrl}`;
  }

  console.log('Scraping URL:', formattedUrl);

  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${firecrawlApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: formattedUrl,
      formats: ['markdown'],
      onlyMainContent: true,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Firecrawl API error:', data);
    return { success: false, error: data.error || 'Scrape failed' };
  }

  const content = data?.data?.markdown || data?.markdown || '';
  return { success: true, content };
}

async function analyzeWebsite(url: string, content: string, lovableApiKey: string): Promise<{ success: boolean; seoScore?: number; changes?: string; error?: string }> {
  const systemPrompt = `You are an expert SEO analyst. Analyze the website content and return a JSON object with:
{
  "seoScore": number (0-100),
  "keyChanges": string (brief summary of notable content/marketing changes, max 100 words)
}

Be consistent in your scoring methodology.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this website (${url}):\n\n${content.substring(0, 10000)}` }
      ],
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    console.error('AI analysis failed:', response.status);
    return { success: false, error: 'AI analysis failed' };
  }

  const aiData = await response.json();
  const analysisText = aiData.choices?.[0]?.message?.content;

  try {
    const analysis = JSON.parse(analysisText);
    return { 
      success: true, 
      seoScore: analysis.seoScore,
      changes: analysis.keyChanges
    };
  } catch {
    console.error('Failed to parse AI response');
    return { success: false, error: 'Parse error' };
  }
}

async function sendAlertEmail(
  resend: InstanceType<typeof Resend>,
  email: string,
  competitorUrl: string,
  oldScore: number,
  newScore: number,
  changes?: string
): Promise<boolean> {
  const hostname = new URL(competitorUrl).hostname;
  const scoreChange = newScore - oldScore;
  const changeDirection = scoreChange > 0 ? '📈 improved' : '📉 decreased';
  const changeColor = scoreChange > 0 ? '#22c55e' : '#ef4444';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0f; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          <div style="background: linear-gradient(135deg, #d4a853 0%, #b8860b 100%); padding: 30px; text-align: center;">
            <h1 style="color: #0a0a0f; margin: 0; font-size: 24px; font-weight: bold;">
              👑 CrownKPI Competitor Alert
            </h1>
          </div>
          
          <div style="padding: 40px;">
            <h2 style="color: #ffffff; margin: 0 0 10px 0; font-size: 20px;">
              Changes detected on ${hostname}
            </h2>
            <p style="color: #9ca3af; margin: 0 0 30px 0;">
              Our daily scan found significant changes to a competitor you're tracking.
            </p>
            
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <div style="margin-bottom: 16px;">
                <span style="color: #9ca3af;">SEO Score: </span>
                <span style="color: ${changeColor}; font-weight: bold; font-size: 18px;">
                  ${oldScore} → ${newScore} (${scoreChange > 0 ? '+' : ''}${scoreChange})
                </span>
              </div>
              <p style="color: #ffffff; margin: 0; font-size: 16px;">
                ${hostname} ${changeDirection} by ${Math.abs(scoreChange)} points
              </p>
            </div>
            
            ${changes ? `
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #d4a853; margin: 0 0 12px 0; font-size: 16px;">What Changed</h3>
              <p style="color: #e5e7eb; margin: 0; line-height: 1.6;">
                ${changes}
              </p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 32px;">
              <a href="${competitorUrl}" style="display: inline-block; background: linear-gradient(135deg, #d4a853 0%, #b8860b 100%); color: #0a0a0f; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                View Website
              </a>
            </div>
          </div>
          
          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding: 20px; text-align: center;">
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              Automated daily check by CrownKPI • Unsubscribe by visiting the app
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: 'CrownKPI Alerts <onboarding@resend.dev>',
      to: [email],
      subject: `${hostname} SEO Score ${changeDirection} - CrownKPI Alert`,
      html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Restrict to service-role / cron invocations only.
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const authHeader = req.headers.get('Authorization') ?? '';
  const provided = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : '';
  if (!serviceKey || provided !== serviceKey) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const startTime = Date.now();
  console.log('🕐 Starting daily competitor check job...');

  // Initialize clients
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Create job run record
  const { data: jobRun, error: jobError } = await supabase
    .from('cron_job_runs')
    .insert({
      job_name: 'daily-competitor-check',
      status: 'running'
    })
    .select()
    .single();

  const jobRunId = jobRun?.id;

  try {
    if (!firecrawlApiKey || !lovableApiKey || !resendApiKey) {
      console.error('Missing required API keys');
      if (jobRunId) {
        await supabase.from('cron_job_runs').update({
          status: 'failed',
          error_message: 'Missing API keys',
          completed_at: new Date().toISOString(),
          duration_seconds: (Date.now() - startTime) / 1000
        }).eq('id', jobRunId);
      }
      return new Response(
        JSON.stringify({ success: false, error: 'Missing API keys' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);

    // Fetch all active subscriptions
    const { data: subscriptions, error: fetchError } = await supabase
      .from('competitor_subscriptions')
      .select('*')
      .eq('is_active', true);

    if (fetchError) {
      console.error('Failed to fetch subscriptions:', fetchError);
      if (jobRunId) {
        await supabase.from('cron_job_runs').update({
          status: 'failed',
          error_message: 'Database error: ' + fetchError.message,
          completed_at: new Date().toISOString(),
          duration_seconds: (Date.now() - startTime) / 1000
        }).eq('id', jobRunId);
      }
      return new Response(
        JSON.stringify({ success: false, error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No active subscriptions to check');
      if (jobRunId) {
        await supabase.from('cron_job_runs').update({
          status: 'completed',
          subscriptions_checked: 0,
          alerts_sent: 0,
          completed_at: new Date().toISOString(),
          duration_seconds: (Date.now() - startTime) / 1000
        }).eq('id', jobRunId);
      }
      return new Response(
        JSON.stringify({ success: true, message: 'No subscriptions', checked: 0, alerts: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Found ${subscriptions.length} active subscriptions`);

    // Group by competitor URL to avoid duplicate scrapes
    const urlGroups = new Map<string, Subscription[]>();
    for (const sub of subscriptions as Subscription[]) {
      const existing = urlGroups.get(sub.competitor_url) || [];
      existing.push(sub);
      urlGroups.set(sub.competitor_url, existing);
    }

    let checked = 0;
    let alertsSent = 0;
    const SCORE_THRESHOLD = 5;

    for (const [url, subs] of urlGroups) {
      console.log(`\n🔍 Checking: ${url}`);
      
      try {
        // Scrape the website
        const scrapeResult = await scrapeWebsite(url, firecrawlApiKey);
        if (!scrapeResult.success || !scrapeResult.content) {
          console.error(`  ❌ Scrape failed for ${url}`);
          continue;
        }

        // Analyze with AI
        const analysisResult = await analyzeWebsite(url, scrapeResult.content, lovableApiKey);
        if (!analysisResult.success || analysisResult.seoScore === undefined) {
          console.error(`  ❌ Analysis failed for ${url}`);
          continue;
        }

        const newScore = analysisResult.seoScore;
        console.log(`  📊 New SEO score: ${newScore}`);

        // Check each subscription for this URL
        for (const sub of subs) {
          checked++;
          const oldScore = sub.last_seo_score;
          
          // Update the subscription with new score
          await supabase
            .from('competitor_subscriptions')
            .update({
              last_seo_score: newScore,
              last_checked_at: new Date().toISOString(),
            })
            .eq('id', sub.id);

          // Check if we should send an alert
          if (oldScore !== null) {
            const scoreDiff = Math.abs(newScore - oldScore);
            
            if (scoreDiff >= SCORE_THRESHOLD) {
              console.log(`  🔔 Score changed by ${scoreDiff} points for ${sub.email}`);
              
              const sent = await sendAlertEmail(
                resend,
                sub.email,
                url,
                oldScore,
                newScore,
                analysisResult.changes
              );
              
              // Log alert to history
              await supabase.from('alert_history').insert({
                subscription_id: sub.id,
                email: sub.email,
                competitor_url: url,
                old_score: oldScore,
                new_score: newScore,
                score_change: newScore - oldScore,
                changes_summary: analysisResult.changes,
                email_sent: sent
              });
              
              if (sent) {
                alertsSent++;
                console.log(`  ✉️ Alert sent to ${sub.email}`);
              }
            } else {
              console.log(`  ℹ️ Score change (${scoreDiff}) below threshold for ${sub.email}`);
            }
          } else {
            console.log(`  ℹ️ First check for ${sub.email}, no comparison available`);
          }
        }

        // Small delay between URLs to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (err) {
        console.error(`  ❌ Error processing ${url}:`, err);
      }
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`\n✅ Job complete in ${duration.toFixed(1)}s: ${checked} checked, ${alertsSent} alerts sent`);

    // Update job run as completed
    if (jobRunId) {
      await supabase.from('cron_job_runs').update({
        status: 'completed',
        subscriptions_checked: checked,
        alerts_sent: alertsSent,
        completed_at: new Date().toISOString(),
        duration_seconds: duration
      }).eq('id', jobRunId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        checked, 
        alerts: alertsSent,
        duration: `${duration.toFixed(1)}s`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Job failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const duration = (Date.now() - startTime) / 1000;
    
    if (jobRunId) {
      await supabase.from('cron_job_runs').update({
        status: 'failed',
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
        duration_seconds: duration
      }).eq('id', jobRunId);
    }
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
