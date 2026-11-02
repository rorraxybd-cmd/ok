export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        
        // রিকোয়েস্ট থেকে ডাটা পার্স করা
        const data = await request.json();
        const { fullName, email, whatsapp, budget, projectDetails, country, countryCode, ipAddress } = data;

        // ভ্যালিডেশন
        if (!fullName || !email || !whatsapp || !budget || !projectDetails) {
            return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Cloudflare D1 Database এ ডেটা ইনসার্ট করা
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
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
