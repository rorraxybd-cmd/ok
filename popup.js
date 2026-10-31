/**
 * rorraxy - Transparent Luxury PWA Installation Popup Manager
 * Description: Zero-background transparency, smooth rotating service tags,
 * install button, 15s auto-hide timer, and persistent storage lock.
 */

(function () {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isInstalled = localStorage.getItem('rorraxy_app_installed');
    const isSessionDismissed = sessionStorage.getItem('rorraxy_session_dismissed');

    if (isStandalone || isInstalled === 'true') {
        return;
    }

    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        :root {
            --gold-gradient: linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%);
            --gold-solid: #d4af37;
            --text-white: #ffffff;
            --font-main: 'Poppins', sans-serif;
        }

        /* ব্যাকগ্রাউন্ড একদম জিরো বা সম্পূর্ণ ট্রান্সপারেন্ট */
        .rorraxy-pwa-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            padding: 20px;
            box-sizing: border-box;
            animation: rorraxyFadeIn 0.2s ease forwards;
        }

        /* কার্ডে কোনো শ্যাডো বা কালার ব্যাকগ্রাউন্ড নেই, শতভাগ স্বচ্ছ */
        .rorraxy-pwa-card {
            width: 100%;
            max-width: 300px;
            background: transparent;
            border: none;
            box-shadow: none;
            text-align: center;
            position: relative;
            font-family: var(--font-main);
            color: var(--text-white);
            padding: 10px;
            cursor: grab;
            user-select: none;
            animation: rorraxyPopScale 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .rorraxy-pwa-card:active {
            cursor: grabbing;
        }

        .rorraxy-pwa-close {
            position: absolute;
            top: -5px;
            right: 15px;
            background: rgba(3, 3, 5, 0.8);
            border: 1px solid rgba(212, 175, 55, 0.5);
            color: var(--gold-solid);
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
        }

        .rorraxy-pwa-close:hover { 
            background: var(--gold-gradient);
            color: #030305;
            transform: scale(1.1);
        }

        /* লোগো এবং চারপাশে ঘুরতে থাকা ৪টি সার্ভিস ট্যাগ */
        .rorraxy-pwa-logo-container {
            position: relative;
            width: 160px;
            height: 160px;
            margin: 0 auto 15px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            animation: rorraxyLuxuryFloat 3s ease-in-out infinite;
        }

        .rorraxy-pwa-logo {
            width: 100px;
            height: 100px;
            object-fit: contain;
            border-radius: 14px;
            position: relative;
            z-index: 3;
            border: 1px solid rgba(212, 175, 55, 0.4);
            background: #000000;
        }

        .rorraxy-orbit-ring {
            position: absolute;
            width: 160px;
            height: 160px;
            border: 1px dashed rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            animation: rorraxyOrbitSpin 12s linear infinite;
            pointer-events: none;
            z-index: 2;
        }

        .rorraxy-orbit-item {
            position: absolute;
            background: rgba(3, 3, 5, 0.9);
            border: 1px solid rgba(212, 175, 55, 0.5);
            color: var(--gold-solid);
            font-size: 7px;
            font-weight: 700;
            padding: 3px 6px;
            border-radius: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
        }

        .item-1 { top: -4px; left: 50%; transform: translateX(-50%); }
        .item-2 { bottom: -4px; left: 50%; transform: translateX(-50%); }
        .item-3 { left: -6px; top: 50%; transform: translateY(-50%); }
        .item-4 { right: -6px; top: 50%; transform: translateY(-50%); }

        /* ইনস্টল বাটন */
        .rorraxy-pwa-btn {
            background: var(--gold-gradient);
            color: #030305;
            border: none;
            padding: 10px 16px;
            font-size: 11px;
            font-weight: 800;
            border-radius: 14px;
            cursor: pointer;
            width: 100%;
            max-width: 180px;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.25);
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: transform 0.15s ease, filter 0.15s ease;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
        }

        .rorraxy-pwa-btn:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
        }

        .rorraxy-btn-title {
            font-size: 11px;
            font-weight: 800;
        }

        .rorraxy-btn-devices {
            font-size: 7px;
            font-weight: 700;
            color: rgba(3, 3, 5, 0.85);
            text-transform: uppercase;
        }

        /* ছোট মিনিমাল উইজেট (১৫ সেকেন্ড পর বা ক্লোজ করলে কর্নারে থাকবে) */
        .rorraxy-minimal-widget {
            position: fixed;
            top: 15px;
            right: 20px;
            background: rgba(3, 3, 5, 0.9);
            border: 1px solid rgba(212, 175, 55, 0.4);
            padding: 6px 12px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 6px;
            z-index: 998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            cursor: pointer;
            user-select: none;
            font-family: var(--font-main);
        }

        .rorraxy-minimal-text {
            font-size: 9px;
            font-weight: 800;
            background: var(--gold-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        @keyframes rorraxyFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rorraxyPopScale { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes rorraxyLuxuryFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
        @keyframes rorraxyOrbitSpin { from { rotate: 0deg; } to { rotate: 360deg; } }
    `;
    document.head.appendChild(style);

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });

    const triggerInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === 'accepted') {
                localStorage.setItem('rorraxy_app_installed', 'true');
                const widget = document.getElementById('rorraxyMinimalWidget');
                if (widget) widget.remove();
            }
            deferredPrompt = null;
        } else {
            // অ্যান্ড্রয়েড বা আইওএস ব্রাউজারের নিজস্ব শেয়ার/ইনস্টল গাইড বা ফলব্যাক
            alert("To install: Tap your browser menu (...) and select 'Add to Home Screen' or 'Install App'.");
        }
    };

    const createMinimalWidget = () => {
        if (document.getElementById('rorraxyMinimalWidget')) return;
        const widget = document.createElement('div');
        widget.id = 'rorraxyMinimalWidget';
        widget.className = 'rorraxy-minimal-widget';
        widget.innerHTML = `<span class="rorraxy-minimal-text"><i class="fa-solid fa-download"></i> INSTALL APP</span>`;
        
        widget.addEventListener('click', async () => {
            await triggerInstall();
        });

        document.body.appendChild(widget);
    };

    if (isSessionDismissed === 'true') {
        createMinimalWidget();
        return;
    }

    // সাইটে প্রবেশের ৩ সেকেন্ড পর পপআপ ভেসে উঠবে
    setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.className = 'rorraxy-pwa-overlay';
        overlay.innerHTML = `
            <div class="rorraxy-pwa-card" id="rorraxyPwaCard">
                <button class="rorraxy-pwa-close" id="rorraxyPwaClose">&times;</button>
                <div class="rorraxy-pwa-logo-container" id="rorraxyLogoClick">
                    <div class="rorraxy-orbit-ring">
                        <span class="rorraxy-orbit-item item-1">B2B</span>
                        <span class="rorraxy-orbit-item item-2">B2C</span>
                        <span class="rorraxy-orbit-item item-3">Solutions</span>
                        <span class="rorraxy-orbit-item item-4">Academy</span>
                    </div>
                    <img src="/512svg.svg" alt="rorraxy" class="rorraxy-pwa-logo">
                </div>
                <div>
                    <button id="rorraxyPwaInstallBtn" class="rorraxy-pwa-btn">
                        <span class="rorraxy-btn-title">Install App</span>
                        <span class="rorraxy-btn-devices">Android / iOS / PC</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const dismissPopup = () => {
            sessionStorage.setItem('rorraxy_session_dismissed', 'true');
            if (overlay.parentNode) overlay.remove();
            createMinimalWidget();
        };

        // পপআপ আসার পর ১৫ সেকেন্ড সময় পাবে, এর মধ্যে ইনস্টল বা ক্লোজ না করলে অটো মিনিমাল বাটন হয়ে যাবে
        const autoHideTimer = setTimeout(() => {
            if (document.body.contains(overlay)) {
                dismissPopup();
            }
        }, 15000);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                clearTimeout(autoHideTimer);
                dismissPopup();
            }
        });

        document.getElementById('rorraxyPwaClose').addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(autoHideTimer);
            dismissPopup();
        });

        document.getElementById('rorraxyLogoClick').addEventListener('click', async (e) => {
            e.stopPropagation();
            clearTimeout(autoHideTimer);
            await triggerInstall();
        });

        document.getElementById('rorraxyPwaInstallBtn').addEventListener('click', async (e) => {
            e.stopPropagation();
            clearTimeout(autoHideTimer);
            await triggerInstall();
        });
    }, 3000);
})();
