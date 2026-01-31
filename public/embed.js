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

    // Fetch testimonials and configuration
    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            const space = data.space;
            const testimonials = Array.isArray(data.testimonials) ? data.testimonials : (Array.isArray(data) ? data : [data]);

            if (!testimonials || testimonials.length === 0) return;

            // Resolve settings: Attribute override > Space settings > Defaults
            const finalLayout = layoutOverride || (space && space.embedLayout) || 'grid';
            const finalStyle = styleOverride || (space && space.cardStyle) || 'modern';
            const customization = (space && space.customStyles) || {};

            // Track View
            if (spaceId) {
                fetch(`${baseUrl}/api/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ spaceId, event: 'view' })
                }).catch(err => console.error('Tracking Error:', err));
            }

            renderWidget(container, testimonials, finalLayout, finalStyle, customization);
        })
        .catch(err => console.error('TestiSpace Embed Error:', err));

    function renderWidget(container, testimonials, layout, cardStyle, custom) {
        // Create Shadow DOM for isolation
        const shadow = container.attachShadow({ mode: 'open' });

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
            borderRadius: custom.borderRadius ? `${custom.borderRadius}px` : '16px'
        };

        // Styles
        const style = document.createElement('style');

        let themeCss = `
            .ts-card { 
                background: ${config.backgroundColor}; 
                color: ${config.textColor}; 
                padding: 1.5rem; 
                border-radius: ${config.borderRadius}; 
                display: flex; flex-direction: column; height: 100%; transition: transform 0.2s; 
                box-sizing: border-box;
            }
        `;

        if (cardStyle === 'modern') {
            themeCss += `
                .ts-card { 
                    border: 1px solid ${config.accentColor}40; 
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
                    backdrop-filter: blur(8px);
                }
            `;
        } else if (cardStyle === 'minimal') {
            themeCss += `.ts-card { border: 1px solid ${config.textColor}20; box-shadow: none; }`;
        } else if (cardStyle === 'classic') {
            themeCss += `.ts-card { border: 2px solid ${config.accentColor}50; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }`;
        } else if (cardStyle === 'gradient') {
            themeCss += `
                .ts-card { 
                    background: linear-gradient(135deg, ${config.accentColor}30, ${config.backgroundColor}); 
                    border: none; 
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2); 
                }
            `;
        }

        let layoutCss = '';
        if (layout === 'grid') {
            layoutCss = '.ts-container { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }';
        } else if (layout === 'carousel') {
            layoutCss = `
                .ts-container { display: flex; gap: 1.5rem; overflow-x: auto; padding-bottom: 1rem; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
                .ts-card { min-width: 300px; scroll-snap-align: start; flex-shrink: 0; }
                .ts-container::-webkit-scrollbar { height: 6px; }
                .ts-container::-webkit-scrollbar-track { background: transparent; }
                .ts-container::-webkit-scrollbar-thumb { background: ${config.accentColor}50; border-radius: 10px; }
            `;
        } else if (layout === 'masonry') {
            layoutCss = `
                .ts-container { column-count: 3; column-gap: 1.5rem; }
                .ts-card { break-inside: avoid; margin-bottom: 1.5rem; height: auto; display: block; }
                @media (max-width: 900px) { .ts-container { column-count: 2; } }
                @media (max-width: 600px) { .ts-container { column-count: 1; } }
            `;
        } else if (layout === 'list') {
            layoutCss = '.ts-container { display: flex; flex-direction: column; gap: 1.5rem; }';
        }

        style.textContent = `
            ${layoutCss}
            ${themeCss}
            .ts-container { font-family: ${config.fontFamily}; }
            .ts-header { display: flex; align-items: center; gap: 0.25rem; margin-bottom: 1rem; color: ${config.accentColor}; font-size: 1.25rem; }
            .ts-content { flex-grow: 1; display: flex; flex-direction: column; gap: 1rem; }
            .ts-text { font-size: 1rem; line-height: 1.6; font-style: italic; opacity: 0.9; }
            .ts-media { width: 100%; border-radius: 12px; overflow: hidden; margin-top: 0.5rem; }
            .ts-media img, .ts-media video { width: 100%; display: block; object-fit: cover; max-height: 400px; }
            .ts-author { display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid ${config.textColor}20; padding-top: 1rem; }
            .ts-avatar { background: ${config.accentColor}; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; flex-shrink: 0; }
            .ts-author-info { display: flex; flex-direction: column; }
            .ts-name { font-weight: 600; font-size: 0.95rem; }
            .ts-designation { font-size: 0.8rem; opacity: 0.7; }
            .ts-powered { margin-top: 1.5rem; text-align: center; font-size: 0.75rem; opacity: 0.6; }
            .ts-powered a { color: ${config.accentColor}; text-decoration: none; }
        `;
        shadow.appendChild(style);

        const wrapper = document.createElement('div');
        wrapper.className = 'ts-container';

        testimonials.forEach(t => {
            const card = document.createElement('div');
            card.className = 'ts-card';

            const settings = t.displaySettings || { showExperience: true, showImage: true, showName: true, showDesignation: true };
            const showExperience = settings.showExperience !== false;
            const showImage = (custom.showImages !== false) && (settings.showImage !== false);
            const showName = settings.showName !== false;
            const showDesignation = settings.showDesignation !== false;

            const textContent = t.textContent || (t.type === 'text' ? t.content : '');
            const mediaUrl = t.mediaUrl || (t.type !== 'text' ? t.content : '');
            const mediaType = t.mediaType !== 'none' ? t.mediaType : (t.type !== 'text' ? t.type : 'none');

            let mediaHtml = '';
            if (showImage) {
                if (mediaType === 'video') {
                    mediaHtml = `<div class="ts-media"><video src="${mediaUrl}" controls></video></div>`;
                } else if (mediaType === 'image') {
                    mediaHtml = `<div class="ts-media"><img src="${mediaUrl}" alt="Testimonial"></div>`;
                }
            }

            const name = (t.userDetails && t.userDetails.name) || t.name || "Anonymous";
            const designation = (t.userDetails && t.userDetails.designation) || t.designation || "";

            card.innerHTML = `
                <div class="ts-header" style="color: ${config.starColor}">${'★'.repeat(t.rating)}</div>
                <div class="ts-content">
                    ${(showExperience && textContent) ? `<div class="ts-text">"${textContent}"</div>` : ''}
                    ${mediaHtml}
                </div>
                <div class="ts-author">
                    <div class="ts-avatar">${name.charAt(0).toUpperCase()}</div>
                    <div class="ts-author-info">
                        ${showName ? `<div class="ts-name">${name}</div>` : ''}
                        ${(showDesignation && designation) ? `<div class="ts-designation">${designation}</div>` : ''}
                    </div>
                </div>
            `;
            wrapper.appendChild(card);
        });

        shadow.appendChild(wrapper);

        const powered = document.createElement('div');
        powered.className = 'ts-powered';
        powered.innerHTML = 'Powered by <a href="https://testispace.vercel.app/" target="_blank">TestiSpace</a>';
        shadow.appendChild(powered);
    }
})();
