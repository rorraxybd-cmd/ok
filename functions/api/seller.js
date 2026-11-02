export async function onRequest(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action"); 
    const sellerId = url.searchParams.get("seller_id");

    if (request.method === "GET") {
      let query = "";
      let stmt;

      if (action === "profile") {
        query = sellerId ? "SELECT * FROM seller_profiles WHERE seller_id = ?" : "SELECT * FROM seller_profiles";
        stmt = sellerId ? env.retail.prepare(query).bind(sellerId) : env.retail.prepare(query);
      } else if (action === "orders") {
        query = sellerId ? "SELECT * FROM seller_orders WHERE seller_id = ?" : "SELECT * FROM seller_orders";
        stmt = sellerId ? env.retail.prepare(query).bind(sellerId) : env.retail.prepare(query);
      } else if (action === "payouts") {
        query = sellerId ? "SELECT * FROM seller_payouts WHERE seller_id = ?" : "SELECT * FROM seller_payouts";
        stmt = sellerId ? env.retail.prepare(query).bind(sellerId) : env.retail.prepare(query);
      } else if (action === "chats") {
        query = sellerId ? "SELECT * FROM seller_support_chats WHERE seller_id = ?" : "SELECT * FROM seller_support_chats";
        stmt = sellerId ? env.retail.prepare(query).bind(sellerId) : env.retail.prepare(query);
      } else {
        return new Response(JSON.stringify({ success: false, error: "Invalid action parameter" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const { results } = await stmt.all();
      return new Response(JSON.stringify({ success: true, data: results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (request.method === "POST") {
      const body = await request.json();

      if (action === "profile") {
        const {
          seller_id, brand_name, full_name, business_desc, email, 
          whatsapp, emergency_phone, country, full_address, 
          doc_type, doc_number, default_payout_method, 
          default_payout_details, logo_url
        } = body;

        const query = `
          INSERT OR REPLACE INTO seller_profiles (
            seller_id, brand_name, full_name, business_desc, email, whatsapp, 
            emergency_phone, country, full_address, doc_type, doc_number, 
            default_payout_method, default_payout_details, logo_url, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', COALESCE((SELECT created_at FROM seller_profiles WHERE seller_id = ?), datetime('now')), datetime('now'))
        `;

        await env.retail.prepare(query).bind(
          seller_id || 1, 
          brand_name || null, 
          full_name || null, 
          business_desc || "", 
          email || null, 
          whatsapp || null, 
          emergency_phone || null, 
          country || "Bangladesh", 
          full_address || null, 
          doc_type || "NID", 
          doc_number || null, 
          default_payout_method || "bKash", 
          default_payout_details || "N/A", 
          logo_url || "",
          seller_id || 1
        ).run();

        return new Response(JSON.stringify({ success: true, message: "Seller profile saved successfully!" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      if (action === "chat") {
        const { seller_id, sender_type, message } = body;
        const query = `
          INSERT INTO seller_support_chats (seller_id, sender_type, message, is_read, created_at)
          VALUES (?, ?, ?, 0, datetime('now'))
        `;
        await env.retail.prepare(query).bind(seller_id || 1, sender_type, message).run();

        return new Response(JSON.stringify({ success: true, message: "Message sent successfully!" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ success: false, error: "Invalid post action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
