/**
 * rorraxy - Ultimate Luxury Transparent PWA Installation Manager
 * Description: Smooth orbit rotation, progress bar, top-right corner minimal badge,
 * and Apple/Android/Desktop native support.
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

        .rorraxy-pwa-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: transparent !important; display: flex; align-items: center;
            justify-content: center; z-index: 99999; padding: 20px; box-sizing: border-box;
            animation: rorraxyFadeIn 0.3s ease forwards; pointer-events: none;
        }

        .rorraxy-pwa-card {
            width: 100%; max-width: 280px; background: transparent !important;
            border: none !important; box-shadow: none !important; text-align: center;
            position: relative; font-family: var(--font-main); color: var(--text-white);
            padding: 10px; pointer-events: auto;
            animation: rorraxyPopScale 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .rorraxy-pwa-close {
            position: absolute; top: -5px; right: 5px; background: rgba(3, 3, 5, 0.85);
            border: 1px solid rgba(212, 175, 55, 0.5); color: var(--gold-solid);
            width: 26px; height: 26px; border-radius: 50%; display: flex;
            align-items: center; justify-content: center; font-size: 14px; font-weight: 700;
            cursor: pointer; z-index: 10; transition: transform 0.2s ease;
        }
        .rorraxy-pwa-close:hover { transform: scale(1.1); }

        .rorraxy-pwa-logo-container {
            position: relative; width: 150px; height: 150px; margin: 0 auto 15px auto;
            display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        .rorraxy-pwa-logo {
            width: 95px; height: 95px; object-fit: contain; border-radius: 12px;
            position: relative; z-index: 3; background: #000000;
            border: 1px solid rgba(212, 175, 55, 0.4);
        }

        /* সার্ভিস সার্কেল রোটেশন এনিমেশন */
        .rorraxy-orbit-ring {
            position: absolute; width: 150px; height: 150px;
            border: 1px dashed rgba(212, 175, 55, 0.5); border-radius: 50%;
            animation: rorraxyOrbitSpin 10s linear infinite; pointer-events: none; z-index: 2;
        }

        .rorraxy-orbit-item {
            position: absolute; background: #030305; border: 1px solid rgba(212, 175, 55, 0.7);
            color: var(--gold-solid); font-size: 7px; font-weight: 700; padding: 2px 6px;
            border-radius: 8px; text-transform: uppercase; white-space: nowrap;
        }

        .item-1 { top: -5px; left: 50%; transform: translateX(-50%); }
        .item-2 { bottom: -5px; left: 50%; transform: translateX(-50%); }
        .item-3 { left: -8px; top: 50%; transform: translateY(-50%); }
        .item-4 { right: -8px; top: 50%; transform: translateY(-50%); }

        .rorraxy-pwa-btn {
            background: var(--gold-gradient); color: #030305; border: none;
            padding: 10px 16px; font-size: 10px; font-weight: 800; border-radius: 14px;
            cursor: pointer; width: 100%; max-width: 200px; text-transform: uppercase;
            letter-spacing: 0.8px; margin: 0 auto 8px auto; display: flex; flex-direction: column;
            align-items: center; gap: 2px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.25);
            transition: transform 0.15s ease;
        }
        .rorraxy-pwa-btn:hover { transform: translateY(-2px); }
        .rorraxy-btn-title { font-size: 11px; font-weight: 800; }
        .rorraxy-btn-devices { font-size: 7px; font-weight: 700; color: rgba(3, 3, 5, 0.8); }

        /* ১৫ সেকেন্ড কাউন্টডাউন প্রোগ্রেস বার */
        .rorraxy-progress-track {
            width: 100%; max-width: 200px; height: 3px; background: rgba(255, 255, 255, 0.1);
            margin: 0 auto; border-radius: 2px; overflow: hidden;
        }
        .rorraxy-progress-bar {
            width: 100%; height: 100%; background: var(--gold-gradient);
            animation: rorraxyShrinkBar 15s linear forwards;
        }

        /* একদম ডান দিকের কোণায় ভাসমান ছোট মিনিমাল ব্যাজ */
        .rorraxy-minimal-widget {
            position: fixed; top: 12px; right: 15px; background: rgba(3, 3, 5, 0.95);
            border: 1px solid rgba(212, 175, 55, 0.5); padding: 6px 14px; border-radius: 20px;
            display: flex; align-items: center; gap: 6px; z-index: 99998; cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.8);
            animation: rorraxyBadgeSlideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .rorraxy-minimal-text {
            font-size: 9px; font-weight: 800; background: var(--gold-gradient);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase;
        }

        /* Apple (iOS) গাইড নোটিফিকেশন */
        .rorraxy-ios-guide {
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(8, 8, 12, 0.95); border: 1px solid rgba(212, 175, 55, 0.6);
            padding: 12px 18px; border-radius: 16px; color: #fff; font-family: var(--font-main);
            font-size: 11px; z-index: 100000; box-shadow: 0 10px 30px rgba(0,0,0,0.9);
            text-align: center; width: 90%; max-width: 320px;
            animation: rorraxySlideUp 0.3s ease forwards;
        }
        .rorraxy-ios-guide b { color: #d4af37; }

        @keyframes rorraxyFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rorraxyPopScale { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes rorraxyOrbitSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rorraxyShrinkBar { from { width: 100%; } to { width: 0%; } }
        @keyframes rorraxyBadgeSlideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes rorraxySlideUp { from { transform: translate(-50%, 50px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
    `;
    document.head.appendChild(style);

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });

    const triggerInstall = async () => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        if (isIOS) {
            const existingGuide = document.getElementById('rorraxyIosGuide');
            if (existingGuide) existingGuide.remove();

            const iosGuide = document.createElement('div');
            iosGuide.id = 'rorraxyIosGuide';
            iosGuide.className = 'rorraxy-ios-guide';
            iosGuide.innerHTML = `
                <div>📱 <b>Apple (iOS) Installation Guide:</b></div>
                <div style="margin-top: 4px; color: #a0a0ab; font-size: 10px;">
                    Tap the <b>Share</b> button <i class="fa-solid fa-arrow-up-from-bracket"></i> below in Safari, then select <b>'Add to Home Screen'</b>.
                </div>
            `;
            document.body.appendChild(iosGuide);

            setTimeout(() => {
                if (iosGuide.parentNode) iosGuide.remove();
            }, 8000);
            return;
        }

        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                localStorage.setItem('rorraxy_app_installed', 'true');
                const widget = document.getElementById('rorraxyMinimalWidget');
                if (widget) widget.remove();
            }
            deferredPrompt = null;
        } else {
            const overlay = document.querySelector('.rorraxy-pwa-overlay');
            if (overlay) overlay.remove();
            createMinimalWidget();
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

    // ৩ সেকেন্ড পর পপআপ ভেসে ওঠার লজিক
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
                        <span class="rorraxy-btn-devices">Android / Apple / Desktop</span>
                    </button>
                    <div class="rorraxy-progress-track">
                        <div class="rorraxy-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const dismissPopup = () => {
            sessionStorage.setItem('rorraxy_session_dismissed', 'true');
            if (overlay.parentNode) overlay.remove();
            createMinimalWidget();
        };

        // ১৫ সেকেন্ড পর অটো মিনিমাইজ হয়ে ডান কোণায় ব্যাজ চলে যাওয়ার টাইমার
        const autoHideTimer = setTimeout(() => {
            if (document.body.contains(overlay)) {
                dismissPopup();
            }
        }, 15000);

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
