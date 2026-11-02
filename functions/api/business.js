export async function onRequestPost(context) {
    // CORS হেডার যুক্ত করা যাতে যেকোনো রিকোয়েস্ট স্মুথলি কাজ করে
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    try {
        const { request, env } = context;
        
        // রিকোয়েস্ট থেকে ডাটা পার্স করা
        const data = await request.json();
        const { fullName, email, whatsapp, budget, projectDetails, country, countryCode, ipAddress } = data;

        // ভ্যালিডেশন চেক
        if (!fullName || !email || !whatsapp || !budget || !projectDetails) {
            return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), {
                status: 400,
                headers: corsHeaders
            });
        }

        // Cloudflare D1 Database এ ডেটা ইনসার্ট করার কুয়েরি
        const query = `
            INSERT INTO project_requests (fullName, email, whatsapp, budget, projectDetails, country, countryCode, ipAddress, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `;

        await env.DB.prepare(query)
            .bind(
                fullName, 
                email, 
                whatsapp, 
                Number(budget), 
                projectDetails, 
                country || 'Global Region', 
                countryCode || 'un', 
                ipAddress || ''
            )
            .run();

        return new Response(JSON.stringify({ success: true, message: "Submitted successfully to Cloudflare!" }), {
            status: 200,
            headers: corsHeaders
        });

    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// OPTIONS মেথড হ্যান্ডেল করার জন্য (CORS প্রিফ্লাইট রিকোয়েস্ট)
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}
