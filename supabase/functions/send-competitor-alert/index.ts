import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Restrict to service-role callers (internal jobs). Prevents anonymous email spam.
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

  try {
    const { email, competitorUrl, oldScore, newScore, changes } = await req.json();

    if (!email || !competitorUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and competitor URL are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);

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
                We noticed significant changes to a competitor you're tracking.
              </p>
              
              <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <span style="color: #9ca3af;">SEO Score</span>
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
                <h3 style="color: #d4a853; margin: 0 0 12px 0; font-size: 16px;">Key Changes</h3>
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
                You're receiving this because you subscribed to competitor alerts on CrownKPI.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('Sending competitor alert email to:', email);

    const { data, error } = await resend.emails.send({
      from: 'CrownKPI Alerts <onboarding@resend.dev>',
      to: [email],
      subject: `${hostname} SEO Score ${changeDirection} - CrownKPI Alert`,
      html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email sent successfully:', data);
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending alert:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send alert';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
