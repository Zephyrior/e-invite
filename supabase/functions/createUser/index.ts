import { serve } from "https://deno.land/x/sift/mod.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Admin client with service role key
const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

serve(async (req) => {
  // CORS headers (allow localhost + your production)
  const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "https://your-production-url.com"];
  const origin = req.headers.get("Origin") || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Handle POST
  if (req.method === "POST") {
    try {
      const { id, full_name, email } = await req.json();

      const { data, error } = await supabaseAdmin.from("users").insert([{ id, auth_id: id, full_name, email }]);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
      }

      return new Response(JSON.stringify({ data }), { status: 200, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
  }

  // Any other method
  return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
});
