(function () {
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    const spaceId = currentScript.getAttribute('data-space-id');
    const layout = currentScript.getAttribute('data-layout') || 'grid'; // grid | carousel

    // Get base URL from the script src
    const scriptSrc = currentScript.src;
    const baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));

    if (!spaceId) return;

    const container = document.createElement('div');
    container.id = `testispace-embed-${spaceId}`;
    currentScript.parentNode.insertBefore(container, currentScript);

    // Fetch testimonials using dynamic base URL
    fetch(`${baseUrl}/api/embed/${spaceId}`)
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) return;
            renderWidget(container, data, layout);
        })
        .catch(err => console.error('TestiSpace Embed Error:', err));

    function renderWidget(container, testimonials, layout) {
        // Create Shadow DOM for isolation
        const shadow = container.attachShadow({ mode: 'open' });

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            .ts-container { font-family: sans-serif; display: grid; gap: 1rem; }
            .ts-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
            .ts-card { background: #1e1b4b; color: white; padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
            .ts-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
            .ts-content { font-size: 1rem; line-height: 1.5; margin-bottom: 1rem; }
            .ts-video { width: 100%; border-radius: 8px; }
            .ts-author { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; font-weight: bold; }
            .ts-check { color: #22c55e; }
        `;
        shadow.appendChild(style);

        const wrapper = document.createElement('div');
        wrapper.className = `ts-container ${layout === 'grid' ? 'ts-grid' : ''}`;

        testimonials.forEach(t => {
            const card = document.createElement('div');
            card.className = 'ts-card';

            let media = '';
            if (t.type === 'video') {
                media = `<video src="${t.content}" controls class="ts-video"></video>`;
            } else if (t.type === 'image') {
                media = `<img src="${t.content}" alt="Testimonial" style="width:100%; border-radius:8px; margin-bottom:1rem;">`;
            }

            card.innerHTML = `
                <div class="ts-header">
                    ${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}
                </div>
                <div class="ts-content">
                    ${media}
                    ${t.type === 'text' ? `"${t.content}"` : ''}
                </div>
                <div class="ts-author">
                    <div style="background:#8b5cf6; color:white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">
                        ${t.userDetails.name.charAt(0)}
                    </div>
                    ${t.userDetails.name}
                </div>
            `;
            wrapper.appendChild(card);
        });

        shadow.appendChild(wrapper);
    }
})();
