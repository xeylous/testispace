export async function verifyTurnstileToken(token: string): Promise<boolean> {
    const secretKey = process.env.CLOUDFLARE_SECRET_KEY || "1x0000000000000000000000000000000AA"; // Default to testing key

    try {
        const formData = new FormData();
        formData.append('secret', secretKey);
        formData.append('response', token);

        const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });

        const data = await check.json();
        return data.success;
    } catch (error) {
        console.error("Turnstile verification failed:", error);
        return false;
    }
}
