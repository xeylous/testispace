(function () {
    const currentScript = document.currentScript || (function () {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    const spaceId = currentScript.getAttribute('data-space-id');
    const testimonialId = currentScript.getAttribute('data-testimonial-id');
    const layout = currentScript.getAttribute('data-layout') || 'grid'; // grid | carousel | single

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

    // Fetch testimonials using dynamic base URL
    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            const testimonials = Array.isArray(data) ? data : [data];
            if (!testimonials || testimonials.length === 0) return;
            renderWidget(container, testimonials, layout);
        })
        .catch(err => console.error('TestiSpace Embed Error:', err));

    function renderWidget(container, testimonials, layout) {
        // Create Shadow DOM for isolation
        const shadow = container.attachShadow({ mode: 'open' });

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            .ts-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: grid; gap: 1rem; }
            .ts-grid { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
            .ts-card { background: #1e1b4b; color: #f8fafc; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; height: 100%; transition: transform 0.2s; }
            .ts-header { display: flex; align-items: center; gap: 0.25rem; margin-bottom: 1rem; color: #fbbf24; font-size: 1.25rem; }
            .ts-content { flex-grow: 1; display: flex; flex-direction: column; gap: 1rem; }
            .ts-text { font-size: 1rem; line-height: 1.6; font-style: italic; color: #e2e8f0; }
            .ts-media { width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
            .ts-media img, .ts-media video { width: 100%; display: block; object-fit: cover; max-height: 400px; }
            .ts-author { display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); pt: 1rem; padding-top: 1rem; }
            .ts-avatar { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; flex-shrink: 0; }
            .ts-author-info { display: flex; flex-direction: column; }
            .ts-name { font-weight: 600; font-size: 0.95rem; }
            .ts-designation { font-size: 0.8rem; color: #94a3b8; }
            .ts-powered { margin-top: 1.5rem; text-align: center; font-size: 0.75rem; color: #94a3b8; }
            .ts-powered a { color: #8b5cf6; text-decoration: none; }
        `;
        shadow.appendChild(style);

        const wrapper = document.createElement('div');
        wrapper.className = `ts-container ${layout === 'grid' ? 'ts-grid' : ''}`;

        testimonials.forEach(t => {
            const card = document.createElement('div');
            card.className = 'ts-card';

            const textContent = t.textContent || (t.type === 'text' ? t.content : '');
            const mediaUrl = t.mediaUrl || (t.type !== 'text' ? t.content : '');
            const mediaType = t.mediaType !== 'none' ? t.mediaType : (t.type !== 'text' ? t.type : 'none');

            let mediaHtml = '';
            if (mediaType === 'video') {
                mediaHtml = `<div class="ts-media"><video src="${mediaUrl}" controls></video></div>`;
            } else if (mediaType === 'image') {
                mediaHtml = `<div class="ts-media"><img src="${mediaUrl}" alt="Testimonial"></div>`;
            }

            card.innerHTML = `
                <div class="ts-header">
                    ${'★'.repeat(t.rating)}
                </div>
                <div class="ts-content">
                    ${mediaHtml}
                    ${textContent ? `<div class="ts-text">"${textContent}"</div>` : ''}
                </div>
                <div class="ts-author">
                    <div class="ts-avatar">
                        ${t.userDetails.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="ts-author-info">
                        <div class="ts-name">${t.userDetails.name}</div>
                        ${t.userDetails.designation ? `<div class="ts-designation">${t.userDetails.designation}</div>` : ''}
                    </div>
                </div>
            `;
            wrapper.appendChild(card);
        });

        shadow.appendChild(wrapper);

        const powered = document.createElement('div');
        powered.className = 'ts-powered';
        powered.innerHTML = 'Powered by <a href="https://testispace.com" target="_blank">TestiSpace</a>';
        shadow.appendChild(powered);
    }
})();
