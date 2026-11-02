window.addEventListener('DOMContentLoaded', async () => {
            // ১. ভেরিফাইড প্যানেল বা সেশন থেকে বর্তমান ইউজারের সঠিক ইমেইল বের করা
            const urlParams = new URLSearchParams(window.location.search);
            let userEmail = urlParams.get('email') || localStorage.getItem('rorraxy_current_seller_email');

            if (!userEmail) {
                userEmail = localStorage.getItem('rorraxy_seller_email') || localStorage.getItem('rorraxy_seller_verified_email');
            }

            if (!userEmail) {
                userEmail = "seller_" + Date.now() + "@rorraxy.com";
            }

            localStorage.setItem('rorraxy_current_seller_email', userEmail);
            document.getElementById('businessEmail').value = userEmail;

            // ২. লোকাল স্টোরেজ চেক
            const storageKey = `rorraxy_seller_profile_${userEmail}`;
            const savedProfile = JSON.parse(localStorage.getItem(storageKey) || 'null');

            if (savedProfile && savedProfile.brandName) {
                fillFormValues(savedProfile);
                renderPreview(savedProfile);
                return;
            }

            // ৩. ক্লাউডফায়ার ডেটাবেস থেকে স্ট্যাটিক আইডি ১ বাদ দিয়ে নির্দিষ্ট ইমেল দিয়ে কুয়েরি করা
            try {
                const response = await fetch(`/api/seller?action=profile&email=${encodeURIComponent(userEmail)}`);
                const result = await response.json();
                
                // যদি ডেটাবেসে এই ইমেলের প্রোফাইল পাওয়া যায়
                if (result.success && result.data && result.data.length > 0) {
                    const dbProfile = result.data[0];
                    if(dbProfile.brand_name) {
                        const formattedData = {
                            brandName: dbProfile.brand_name,
                            businessEmail: dbProfile.email || userEmail,
                            fullName: dbProfile.full_name || '',
                            businessDesc: dbProfile.business_desc || '',
                            whatsapp: dbProfile.whatsapp || '',
                            phone: dbProfile.emergency_phone || '',
                            country: dbProfile.country || 'Bangladesh',
                            address: dbProfile.full_address || '',
                            docType: dbProfile.doc_type || 'NID',
                            docNum: dbProfile.doc_number || '',
                            tradeLicense: dbProfile.default_payout_details || '',
                            logo: dbProfile.logo_url || compressedAvatarData
                        };
                        localStorage.setItem(storageKey, JSON.stringify(formattedData));
                        fillFormValues(formattedData);
                        renderPreview(formattedData);
                        return;
                    }
                }
            } catch (err) {
                console.log("Cloudflare load notice:", err);
            }

            // ৪. ডেটা না থাকলে একদম ফাঁকা ফরম দেখাবে যাতে নতুন ইউজার তার তথ্য দিতে পারে
            document.getElementById('businessInfoForm').style.display = 'block';
            document.getElementById('profilePreviewSection').style.display = 'none';
        });
