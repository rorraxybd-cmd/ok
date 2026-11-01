/**
 * rorraxy - Ultimate Luxury Transparent PWA Installation Manager
 * Description: Zero shadow/effects, smooth animations, black aesthetic integration,
 * and direct native install handling.
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

        /* ডানে-বামে অতিরিক্ত স্ক্রল এবং হোয়াইট স্পেস রোধ করার জন্য গ্লোবাল রুলস */
        html, body {
            max-width: 100vw !important;
            overflow-x: hidden !important;
            background-color: #0b0b0b !important;
        }

        .rorraxy-pwa-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.4) !important; display: flex; align-items: center;
            justify-content: center; z-index: 99999; padding: 20px; box-sizing: border-box;
            animation: rorraxyFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .rorraxy-pwa-card {
            width: 100%; max-width: 280px; background: transparent !important;
            border: none !important; box-shadow: none !important; text-align: center;
            position: relative; font-family: var(--font-main); color: var(--text-white);
            padding: 10px;
            animation: rorraxyPopScale 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .rorraxy-pwa-close {
            position: absolute; top: -5px; right: 5px; background: rgba(3, 3, 5, 0.9);
            border: 1px solid rgba(212, 175, 55, 0.4); color: var(--gold-solid);
            width: 28px; height: 28px; border-radius: 50%; display: flex;
            align-items: center; justify-content: center; font-size: 14px; font-weight: 700;
            cursor: pointer; z-index: 10; transition: transform 0.2s ease;
        }
        .rorraxy-pwa-close:hover { transform: scale(1.1); background: var(--gold-gradient); color: #000; }

        .rorraxy-pwa-logo-container {
            position: relative; width: 150px; height: 150px; margin: 0 auto 15px auto;
            display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        .rorraxy-pwa-logo {
            width: 95px; height: 95px; object-fit: contain; border-radius: 14px;
            position: relative; z-index: 3; background: #000000;
            border: 1px solid rgba(212, 175, 55, 0.4);
            box-shadow: none !important;
        }

        .rorraxy-orbit-ring {
            position: absolute; width: 150px; height: 150px;
            border: 1px dashed rgba(212, 175, 55, 0.3); border-radius: 50%;
            animation: rorraxyOrbitSpin 14s linear infinite; pointer-events: none; z-index: 2;
        }

        .rorraxy-orbit-item {
            position: absolute; background: #030305; border: 1px solid rgba(212, 175, 55, 0.5);
            color: var(--gold-solid); font-size: 7px; font-weight: 700; padding: 2px 6px;
            border-radius: 8px; text-transform: uppercase; white-space: nowrap;
            box-shadow: none !important;
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
            align-items: center; gap: 2px; box-shadow: none !important;
            transition: transform 0.2s ease, filter 0.2s ease;
        }
        .rorraxy-pwa-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .rorraxy-btn-title { font-size: 11px; font-weight: 800; }
        .rorraxy-btn-devices { font-size: 7px; font-weight: 700; color: rgba(3, 3, 5, 0.85); }

        .rorraxy-progress-track {
            width: 100%; max-width: 200px; height: 2px; background: rgba(255, 255, 255, 0.08);
            margin: 0 auto; border-radius: 2px; overflow: hidden;
        }
        .rorraxy-progress-bar {
            width: 100%; height: 100%; background: var(--gold-gradient);
            animation: rorraxyShrinkBar 15s linear forwards;
        }

        .rorraxy-minimal-widget {
            position: fixed; top: 12px; right: 15px; background: rgba(3, 3, 5, 0.95);
            border: 1px solid rgba(212, 175, 55, 0.4); padding: 6px 14px; border-radius: 20px;
            display: flex; align-items: center; gap: 6px; z-index: 99998; cursor: grab;
            box-shadow: none !important; user-select: none;
            animation: rorraxyBadgeSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .rorraxy-minimal-widget:active { cursor: grabbing; }
        .rorraxy-minimal-text {
            font-size: 9px; font-weight: 800; background: var(--gold-gradient);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase;
            pointer-events: none;
        }

        .rorraxy-ios-guide {
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(8, 8, 12, 0.95); border: 1px solid rgba(212, 175, 55, 0.5);
            padding: 12px 18px; border-radius: 16px; color: #fff; font-family: var(--font-main);
            font-size: 11px; z-index: 100000; box-shadow: none !important;
            text-align: center; width: 90%; max-width: 320px;
            animation: rorraxySlideUp 0.35s ease forwards;
        }
        .rorraxy-ios-guide b { color: #d4af37; }

        @keyframes rorraxyFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rorraxyPopScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes rorraxyOrbitSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rorraxyShrinkBar { from { width: 100%; } to { width: 0%; } }
        @keyframes rorraxyBadgeSlideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes rorraxySlideUp { from { transform: translate(-50%, 30px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
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
                    Tap the <b>Share</b> button below in Safari, then select <b>'Add to Home Screen'</b>.
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

    const makeDraggable = (elm) => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;

        elm.onmousedown = dragMouseDown;
        elm.ontouchstart = dragMouseDown;

        function dragMouseDown(e) {
            isDragging = false;
            if (e.type === 'touchstart') {
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
            } else {
                pos3 = e.clientX;
                pos4 = e.clientY;
            }
            document.onmouseup = closeDragElement;
            document.ontouchend = closeDragElement;
            document.onmousemove = elementDrag;
            document.ontouchmove = elementDrag;
        }

        function elementDrag(e) {
            isDragging = true;
            e = e || window.event;
            let clientX, clientY;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;

            elm.style.top = (elm.offsetTop - pos2) + "px";
            elm.style.left = (elm.offsetLeft - pos1) + "px";
            elm.style.right = "auto";
            elm.style.bottom = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.ontouchend = null;
            document.onmousemove = null;
            document.ontouchmove = null;
            setTimeout(() => { isDragging = false; }, 50);
        }

        elm.dataset.checkDrag = () => isDragging;
    };

    const createMinimalWidget = () => {
        if (document.getElementById('rorraxyMinimalWidget')) return;
        const widget = document.createElement('div');
        widget.id = 'rorraxyMinimalWidget';
        widget.className = 'rorraxy-minimal-widget';
        widget.innerHTML = `<span class="rorraxy-minimal-text"><i class="fa-solid fa-download"></i> INSTALL APP</span>`;
        
        widget.addEventListener('click', async () => {
            if (widget.dataset.checkDrag && widget.dataset.checkDrag()) return;
            await triggerInstall();
        });

        document.body.appendChild(widget);
        makeDraggable(widget);
    };

    if (isSessionDismissed === 'true') {
        createMinimalWidget();
        return;
    }

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
                    <img src="/icon-512.png" alt="rorraxy" class="rorraxy-pwa-logo">
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

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                clearTimeout(autoHideTimer);
                dismissPopup();
            }
        });

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
