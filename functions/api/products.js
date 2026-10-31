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
    // ১. GET রিকোয়েস্ট: সমস্ত প্রোডাক্ট বা নির্দিষ্ট কোডের প্রোডাক্ট দেখার জন্য (আউটপুট)
    if (request.method === "GET") {
      const url = new URL(request.url);
      const productCode = url.searchParams.get("code");
      const sellerId = url.searchParams.get("seller_id");

      let query = "SELECT * FROM products";
      let params = [];
      let conditions = [];

      if (productCode) {
        conditions.push("product_code = ?");
        params.push(productCode);
      }
      
      if (sellerId) {
        conditions.push("seller_id = ?");
        params.push(sellerId);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      const stmt = env.retail.prepare(query).bind(...params);
      const { results } = await stmt.all();

      return new Response(JSON.stringify({ success: true, data: results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // ২. POST রিকোয়েস্ট: নতুন প্রোডাক্ট বা তথ্য ইনপুট দেওয়ার জন্য
    if (request.method === "POST") {
      const body = await request.json();
      
      const {
        seller_id,
        product_code,
        title,
        upload_mode,
        category,
        price,
        market_price,
        dropship_base_price,
        dropship_resell_price,
        price_sample,
        price_min_whole,
        price_bulk,
        stock,
        moq,
        image_url,
        images_json,
        video_url,
        youtube_video,
        youtube_live,
        facebook_live,
        target_country,
        discount_rate,
        allow_custom_note,
        chat_with_seller,
        description
      } = body;

      const insertQuery = `
        INSERT INTO products (
          seller_id, product_code, title, upload_mode, category, price, market_price, 
          dropship_base_price, dropship_resell_price, price_sample, price_min_whole, 
          price_bulk, stock, moq, image_url, images_json, video_url, youtube_video, 
          youtube_live, facebook_live, target_country, discount_rate, allow_custom_note, 
          chat_with_seller, description, like_count, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'))
      `;

      await env.retail.prepare(insertQuery).bind(
        seller_id || null,
        product_code || null,
        title || null,
        upload_mode || null,
        category || null,
        price || null,
        market_price || null,
        dropship_base_price || null,
        dropship_resell_price || null,
        price_sample || null,
        price_min_whole || null,
        price_bulk || null,
        stock || null,
        moq || null,
        image_url || null,
        images_json ? JSON.stringify(images_json) : null,
        video_url || null,
        youtube_video || null,
        youtube_live || null,
        facebook_live || null,
        target_country || null,
        discount_rate || null,
        allow_custom_note ? 1 : 0,
        chat_with_seller ? 1 : 0,
        description || null
      ).run();

      return new Response(JSON.stringify({ success: true, message: "Product uploaded successfully!" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // ৩. PUT রিকোয়েস্ট: হোমপেজে কেউ লাইক করলে like_count বাড়িয়ে নেওয়ার জন্য
    if (request.method === "PUT") {
      const body = await request.json();
      const { product_code } = body;

      if (!product_code) {
        return new Response(JSON.stringify({ success: false, error: "Product code is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const updateQuery = `
        UPDATE products 
        SET like_count = COALESCE(like_count, 0) + 1 
        WHERE product_code = ?
      `;

      await env.retail.prepare(updateQuery).bind(product_code).run();

      return new Response(JSON.stringify({ success: true, message: "Like count updated successfully!" }), {
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
