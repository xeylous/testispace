(function () {
    const currentScript = document.currentScript || (function () {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    const spaceId = currentScript.getAttribute('data-space-id');
    const testimonialId = currentScript.getAttribute('data-testimonial-id');
    const layoutOverride = currentScript.getAttribute('data-layout');
    const styleOverride = currentScript.getAttribute('data-style');

    // Get base URL from the script src
    const scriptSrc = currentScript.src;
    const baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));

    if (!spaceId && !testimonialId) return;

    const container = document.createElement('div');
    container.className = 'testispace-embed-container';
    currentScript.parentNode.insertBefore(container, currentScript);

    // Dynamic endpoint
    const endpoint = testimonialId
        ? `${baseUrl}/api/embed/single/${testimonialId}`
        : `${baseUrl}/api/embed/${spaceId}`;

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) return resolve();
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    let pusherInstance = null;
    let currentData = null;

    function init(data) {
        currentData = data;
        const space = data.space;
        const testimonials = Array.isArray(data.testimonials) ? data.testimonials : (Array.isArray(data) ? data : [data]);

        if (!testimonials || testimonials.length === 0) {
            // Check if we need to clear container but keep it for future updates
            // But we need to clear shadow root content if it exists
            if (container.shadowRoot) container.shadowRoot.innerHTML = '<div style="padding: 20px; text-align: center; color: #888; font-family: sans-serif;">No testimonials to display.</div>';
            return;
        }

        // Resolve settings
        const finalLayout = layoutOverride || (space && space.embedLayout) || 'grid';
        const finalStyle = styleOverride || (space && space.cardStyle) || 'modern';
        const customization = (space && space.customStyles) || {};

        renderWidget(container, testimonials, finalLayout, finalStyle, customization);

        // Real-time updates
        if (data.config && data.config.pusherKey && !pusherInstance && spaceId) {
            loadScript("https://js.pusher.com/8.2.0/pusher.min.js").then(() => {
                // @ts-ignore
                pusherInstance = new Pusher(data.config.pusherKey, {
                    cluster: data.config.pusherCluster
                });
                const channel = pusherInstance.subscribe(`space-${spaceId}`);

                channel.bind('update', (event) => {
                    console.log('Real-time update received:', event);
                    // Refetch to get latest data
                    fetchData();
                });
            }).catch(console.error);
        }
    }

    function fetchData() {
        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                init(data);
            })
            .catch(err => console.error('TestiSpace Embed Error:', err));
    }

    // Initial Fetch
    fetchData();

    // Tracking
    if (spaceId) {
        fetch(`${baseUrl}/api/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spaceId, event: 'view' })
        }).catch(err => console.error('Tracking Error:', err));
    }

    function renderWidget(container, testimonials, layout, cardStyle, custom) {
        // Create Shadow DOM for isolation or get existing
        let shadow = container.shadowRoot;
        if (!shadow) {
            shadow = container.attachShadow({ mode: 'open' });
        } else {
            shadow.innerHTML = ''; // Clear for re-render
        }

        // Auto-theme detection
        const autoTheme = container.getAttribute('data-theme') === 'auto' || custom.theme === 'auto';
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        const defaultBg = autoTheme ? (prefersDark ? '#1e1b4b' : '#ffffff') : '#1e1b4b';
        const defaultText = autoTheme ? (prefersDark ? '#f8fafc' : '#0f172a') : '#f8fafc';

        // Configuration mapping
        const config = {
            backgroundColor: custom.backgroundColor || defaultBg,
            textColor: custom.textColor || defaultText,
            accentColor: custom.accentColor || '#8b5cf6',
            starColor: custom.starColor || '#eab308',
            fontFamily: custom.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            borderRadius: custom.borderRadius ? `${custom.borderRadius}px` : '16px',
            containerBackground: custom.containerBackground || 'transparent'
        };

        // Styles
        const style = document.createElement('style');

        let themeCss = `
            .ts-card { 
                background: ${config.backgroundColor}; 
                color: ${config.textColor}; 
                padding: 1.5rem; 
                border-radius: ${config.borderRadius}; 
                display: flex; flex-direction: column; height: 100%; 
                transition: transform 0.3s ease, opacity 0.3s ease; 
                box-sizing: border-box;
                position: relative;
                -webkit-font-smoothing: antialiased;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
        `;

        // Card Styles
        if (cardStyle === 'modern') {
            themeCss += `.ts-card { border: 1px solid ${config.accentColor}40; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); backdrop-filter: blur(8px); }`;
        } else if (cardStyle === 'minimal') {
            themeCss += `.ts-card { border: 1px solid ${config.textColor}20; box-shadow: none; }`;
        } else if (cardStyle === 'classic') {
            themeCss += `.ts-card { border: 2px solid ${config.accentColor}50; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }`;
        } else if (cardStyle === 'gradient') {
            themeCss += `.ts-card { background: linear-gradient(135deg, ${config.accentColor}30, ${config.backgroundColor}); border: none; box-shadow: 0 8px 16px rgba(0,0,0,0.2); }`;
        }

        // Layout CSS - Responsive Updates
        let layoutCss = '';
        if (layout === 'grid') {
            layoutCss = `
                .ts-layout-wrapper { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
                @media (max-width: 640px) { .ts-layout-wrapper { grid-template-columns: 1fr; } }
            `;
        } else if (layout === 'carousel') {
            layoutCss = `
                .ts-layout-wrapper { display: flex; gap: 1.5rem; overflow-x: auto; padding-bottom: 1rem; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
                .ts-card { min-width: 300px; scroll-snap-align: start; flex-shrink: 0; }
                @media (max-width: 480px) { .ts-card { min-width: 85vw; } }
                .ts-layout-wrapper::-webkit-scrollbar { height: 6px; }
                .ts-layout-wrapper::-webkit-scrollbar-track { background: transparent; }
                .ts-layout-wrapper::-webkit-scrollbar-thumb { background: ${config.accentColor}50; border-radius: 10px; }
            `;
        } else if (layout === 'masonry') {
            layoutCss = `
                .ts-layout-wrapper { column-count: 3; column-gap: 1.5rem; }
                .ts-card { break-inside: avoid; margin-bottom: 1.5rem; height: auto; display: block; }
                @media (max-width: 900px) { .ts-layout-wrapper { column-count: 2; } }
                @media (max-width: 600px) { .ts-layout-wrapper { column-count: 1; } }
            `;
        } else if (layout === 'list') {
            layoutCss = '.ts-layout-wrapper { display: flex; flex-direction: column; gap: 1.5rem; }';
        } else if (layout === 'marquee') {
            layoutCss = `
                .ts-layout-wrapper { overflow: hidden; white-space: nowrap; position: relative; padding: 1rem 0; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
                .ts-marquee-track { display: inline-flex; animation: marquee 30s linear infinite; gap: 2rem; }
                .ts-card { width: 350px; white-space: normal; flex-shrink: 0; }
                .ts-container:hover .ts-marquee-track { animation-play-state: paused; }
                @media (max-width: 480px) { .ts-card { width: 280px; } }
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            `;
        } else if (layout === 'stack') {
            layoutCss = `
                .ts-layout-wrapper { position: relative; height: 400px; max-width: 600px; margin: 0 auto; perspective: 1000px; }
                .ts-card { position: absolute; top: 0; left: 0; width: 100%; height: 100%; transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: center bottom; background: ${config.backgroundColor}; }
                @media (max-width: 480px) { .ts-layout-wrapper { height: 450px; } }
            `;
        } else if (layout === 'animated') {
            layoutCss = `
                .ts-layout-wrapper { position: relative; max-width: 800px; margin: 0 auto; }
                .ts-animated-stack { display: grid; grid-template-areas: "stack"; overflow: hidden; }
                .ts-card { grid-area: stack; transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out; opacity: 0; transform: scale(0.95); pointer-events: none; }
                .ts-card.active { opacity: 1; transform: scale(1); pointer-events: auto; z-index: 10; }
                .ts-nav { display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
                .ts-btn { background: ${config.accentColor}20; color: ${config.textColor}; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; transition: all 0.2s; }
                .ts-btn:hover { transform: scale(1.1); background: ${config.accentColor}40; }
                .ts-dots { display: flex; gap: 0.5rem; align-items: center; }
                .ts-dot { width: 8px; height: 8px; border-radius: 4px; background: ${config.textColor}30; border: none; cursor: pointer; transition: all 0.3s; }
                .ts-dot.active { width: 24px; background: ${config.accentColor}; }
                @media (max-width: 480px) { .ts-card { width: 100%; } }
            `;
        }

        // Shared CSS
        style.textContent = `
            ${themeCss}
            ${layoutCss}
            .ts-container { 
                font-family: ${config.fontFamily}; 
                background: ${config.containerBackground}; 
                padding: 1.5rem; 
                border-radius: ${config.borderRadius}; 
                transition: background 0.3s; 
            }
            .ts-header { display: flex; align-items: center; gap: 0.25rem; margin-bottom: 1rem; color: ${config.starColor}; font-size: 1.25rem; }
            .ts-content { flex-grow: 1; display: flex; flex-direction: column; gap: 1rem; }
            .ts-text { font-size: 1rem; line-height: 1.6; font-style: italic; opacity: 0.9; }
            .ts-media { width: 100%; border-radius: 12px; overflow: hidden; margin-top: 0.5rem; }
            .ts-media img, .ts-media video { width: 100%; display: block; object-fit: cover; max-height: 400px; }
            .ts-author { display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid ${config.textColor}20; padding-top: 1rem; }
            .ts-avatar { background: ${config.accentColor}; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; flex-shrink: 0; object-fit: cover; }
            .ts-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
            .ts-author-info { display: flex; flex-direction: column; }
            .ts-name { font-weight: 600; font-size: 0.95rem; }
            .ts-designation { font-size: 0.8rem; opacity: 0.7; }
            .ts-powered { margin-top: 1.5rem; text-align: center; font-size: 0.75rem; opacity: 0.6; }
            .ts-powered a { color: ${config.accentColor}; text-decoration: none; }
        `;
        shadow.appendChild(style);

        const containerDiv = document.createElement('div');
        containerDiv.className = 'ts-container';

        const wrapper = document.createElement('div');
        wrapper.className = 'ts-layout-wrapper';
        containerDiv.appendChild(wrapper);

        // Helper to create card
        const createCard = (t) => {
            const card = document.createElement('div');
            card.className = 'ts-card';

            const settings = t.displaySettings || { showExperience: true, showImage: true, showName: true, showDesignation: true };
            const showExperience = settings.showExperience !== false;
            const showImage = (custom.showImages !== false) && (settings.showImage !== false);
            // Default to true if custom.showImages is undefined (assuming global ON default) but checking if explicitly false

            const showName = settings.showName !== false;
            const showDesignation = settings.showDesignation !== false;

            const textContent = t.textContent || (t.type === 'text' ? t.content : '');
            const mediaUrl = t.mediaUrl || (t.type !== 'text' ? t.content : '');
            const mediaType = t.mediaType !== 'none' ? t.mediaType : (t.type !== 'text' ? t.type : 'none');

            let mediaHtml = '';
            if (showImage && mediaUrl) {
                if (mediaType === 'video') {
                    mediaHtml = `<div class="ts-media"><video src="${mediaUrl}" controls></video></div>`;
                } else {
                    mediaHtml = `<div class="ts-media"><img src="${mediaUrl}" alt="Testimonial"></div>`;
                }
            }

            const name = (t.userDetails && t.userDetails.name) || t.name || "Anonymous";
            const designation = (t.userDetails && t.userDetails.designation) || t.designation || "";
            const avatarUrl = (t.userDetails && t.userDetails.avatar) || t.avatar;

            let avatarHtml = `<div class="ts-avatar">${name.charAt(0).toUpperCase()}</div>`;
            if (showImage && avatarUrl) {
                avatarHtml = `<div class="ts-avatar"><img src="${avatarUrl}" alt="${name}"></div>`;
            }

            card.innerHTML = `
                <div class="ts-header">${'★'.repeat(t.rating)}</div>
                <div class="ts-content">
                    ${(showExperience && textContent) ? `<div class="ts-text">"${textContent}"</div>` : ''}
                    ${mediaHtml}
                </div>
                <div class="ts-author">
                    ${avatarHtml}
                    <div class="ts-author-info">
                        ${showName ? `<div class="ts-name">${name}</div>` : ''}
                        ${(showDesignation && designation) ? `<div class="ts-designation">${designation}</div>` : ''}
                    </div>
                </div>
            `;
            return card;
        };

        // Layout Renderers with Safety Checks
        const layouts = {
            marquee: () => {
                const track = document.createElement('div');
                track.className = 'ts-marquee-track';
                // Double the items for seamless loop
                [...testimonials, ...testimonials].forEach(t => {
                    track.appendChild(createCard(t));
                });
                wrapper.appendChild(track);
            },
            stack: () => {
                const cards = testimonials.map(createCard);
                cards.forEach(c => wrapper.appendChild(c));
                let activeIdx = 0;
                let intervalId;

                const updateStack = () => {
                    if (!containerDiv.isConnected) return clearInterval(intervalId); // Cleanup check
                    cards.forEach((card, idx) => {
                        const offset = (idx - activeIdx + cards.length) % cards.length;
                        const zIndex = cards.length - offset;
                        const scale = 1 - offset * 0.05; // 0, 1: 0.95, 2: 0.9
                        const translateY = offset * 15; // 0, 1: 15px, 2: 30px
                        const translateX = offset * 10; // Extra horizontal definition
                        const rotateY = offset * 2; // Extra rotation

                        const opacity = offset < 3 ? 1 - offset * 0.2 : 0;
                        const pointerEvents = offset === 0 ? 'auto' : 'none';

                        card.style.zIndex = zIndex;
                        card.style.opacity = opacity;
                        card.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) rotateY(${rotateY}deg)`;
                        card.style.pointerEvents = pointerEvents;

                        // Dynamic shadow based on offset to match React
                        const shadowBlur = 30 + offset * 10;
                        const shadowSpread = Math.max(20 - offset * 5, 10);
                        const shadowColor = config.accentColor; // Simplified for JS

                        // We need to keep base card styles but override shadow if we want perfect match, 
                        // but sticking to transform is most important for "animation".

                        const alpha = Math.max(20 - offset * 5, 10);
                        card.style.boxShadow = `0 ${10 + offset * 5}px ${30 + offset * 10}px ${config.accentColor}${alpha}`;

                        if (offset === 0) {
                            card.style.borderColor = config.accentColor;
                            card.style.filter = "none";
                        } else {
                            card.style.borderColor = 'transparent';
                            // card.style.filter = "grayscale(100%)"; // Optional: dim background cards
                        }
                    });
                };

                // Add click handlers
                cards.forEach((card, idx) => {
                    card.onclick = () => {
                        activeIdx = idx;
                        updateStack();
                    };
                });

                updateStack();
                intervalId = setInterval(() => {
                    activeIdx = (activeIdx + 1) % cards.length;
                    updateStack();
                }, 4000);
            },
            animated: () => {
                const stackContainer = document.createElement('div');
                stackContainer.className = 'ts-animated-stack';

                const cards = testimonials.map(createCard);
                cards.forEach(c => stackContainer.appendChild(c));
                wrapper.appendChild(stackContainer); // Add stack container to wrapper

                let activeIdx = 0;
                let intervalId;

                const nav = document.createElement('div');
                nav.className = 'ts-nav';

                const prevBtn = document.createElement('button');
                prevBtn.className = 'ts-btn';
                prevBtn.innerHTML = '‹';
                prevBtn.onclick = () => {
                    activeIdx = (activeIdx - 1 + cards.length) % cards.length;
                    updateAnimated();
                };

                const nextBtn = document.createElement('button');
                nextBtn.className = 'ts-btn';
                nextBtn.innerHTML = '›';
                nextBtn.onclick = () => {
                    activeIdx = (activeIdx + 1) % cards.length;
                    updateAnimated();
                };

                const dots = document.createElement('div');
                dots.className = 'ts-dots';

                const updateAnimated = () => {
                    if (!containerDiv.isConnected) return clearInterval(intervalId); // Cleanup
                    cards.forEach((c, i) => {
                        if (i === activeIdx) c.classList.add('active');
                        else c.classList.remove('active');
                    });

                    // Re-render dots
                    dots.innerHTML = '';
                    cards.forEach((_, i) => {
                        const dot = document.createElement('button');
                        dot.className = `ts-dot ${i === activeIdx ? 'active' : ''}`;
                        dot.onclick = () => {
                            activeIdx = i;
                            updateAnimated();
                        };
                        dots.appendChild(dot);
                    });
                };

                nav.appendChild(prevBtn);
                nav.appendChild(dots);
                nav.appendChild(nextBtn);

                wrapper.appendChild(nav); // Append nav after stack

                updateAnimated();
                intervalId = setInterval(() => {
                    activeIdx = (activeIdx + 1) % cards.length;
                    updateAnimated();
                }, 5000);
            },
            default: () => {
                testimonials.forEach(t => wrapper.appendChild(createCard(t)));
            }
        };

        if (layouts[layout]) {
            layouts[layout]();
        } else {
            layouts.default();
        }

        shadow.appendChild(containerDiv);

        const powered = document.createElement('div');
        powered.className = 'ts-powered';
        powered.innerHTML = 'Powered by <a href="https://testispace.vercel.app/" target="_blank">TestiSpace</a>';
        shadow.appendChild(powered);
    }
})();
