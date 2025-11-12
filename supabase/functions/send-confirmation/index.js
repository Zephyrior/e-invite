// supabase/functions/send-confirmation/index.ts
import { serve } from "https://deno.land/std@0.155.0/http/server.ts";

serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const body = await req.json();
    const { fullName, email, response, numVisitors } = body;

    if (!email) return new Response("Missing email", { status: 400 });

    const SENDGRID_KEY = Deno.env.get("SENDGRID_API_KEY");
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@yourdomain.com";

    const sgPayload = {
      personalizations: [
        {
          to: [{ email }],
          subject: "RSVP Confirmation",
        },
      ],
      from: { email: FROM_EMAIL, name: "E-Invite Team" },
      content: [
        {
          type: "text/plain",
          value:
            `Hi ${fullName || "Guest"},\n\n` +
            `Thanks for your RSVP.\n` +
            `Are you coming: ${response}\n` +
            `Number of visitors: ${numVisitors ?? 0}\n\n` +
            `— See you soon!`,
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
      return new Response(JSON.stringify({ error: errText }), { status: 502 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
});
