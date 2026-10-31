export async function onRequest(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file"); // ফর্ম থেকে ফাইল ধরবে
    const bucketType = formData.get("type") || "image"; // 'image' অথবা 'video'

    if (!file) {
      return new Response(JSON.stringify({ success: false, error: "No file uploaded" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // ফাইলের একটি ইউনিক নাম তৈরি করা
    const fileName = `${Date.now()}-${file.name}`;
    
    // কোন R2 বাকেটে যাবে তা সিলেক্ট করা (image বা video)
    const targetBucket = bucketType === "video" ? env.video : env.image;

    // R2-এ ফাইল আপলোড করা
    await targetBucket.put(fileName, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // ফাইলের অ্যাক্সেস করার ইউআরএল তৈরি (আপনার ডোমেন অনুযায়ী)
    const fileUrl = `https://rorraxy.com/cdn/${fileName}`; // অথবা আপনার স্টোরেজ লিংক

    return new Response(JSON.stringify({ 
      success: true, 
      message: "File uploaded to R2 successfully!", 
      url: fileUrl,
      file_name: fileName
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
