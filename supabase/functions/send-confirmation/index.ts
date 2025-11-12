import { serve } from "https://deno.land/std@0.155.0/http/server.ts";

serve(async (req) => {
  // Handle preflight request

  const FRONTEND_URL = "http://localhost:5173";
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": FRONTEND_URL,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
      },
    });
  }

  try {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const body = await req.json();
    const { fullName, email, response, numVisitors, notes } = body;

    const SENDGRID_KEY = Deno.env.get("SENDGRID_API_KEY");
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@yourdomain.com";

    const emailBody =
      response === "Yes"
        ? `Hi ${fullName || "Guest"},\n\n` +
          `Thanks for your RSVP.\n` +
          `Are you coming: ${response}\n` +
          `Number of guests: ${numVisitors ?? 0}\n\n` +
          `— See you soon!`
        : `Hi ${fullName || "Guest"},\n\n` +
          `Thanks for your RSVP.\n` +
          `Are you coming: ${response}\n` +
          `Note: ${notes || "No additional notes"}\n\n` +
          `— Thank you!`;

    const sgPayload = {
      personalizations: [{ to: [{ email }], subject: "RSVP Confirmation" }],
      from: { email: FROM_EMAIL, name: "E-Invite Team" },
      content: [
        {
          type: "text/plain",
          value: emailBody,
        },
      ],
    };

    const sgRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sgPayload),
    });

    if (!sgRes.ok) {
      const errText = await sgRes.text();
      console.error("SendGrid error:", errText);
      return new Response(JSON.stringify({ error: errText }), { status: 502, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Access-Control-Allow-Origin": FRONTEND_URL }, // ✅ add CORS header here too
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
});
