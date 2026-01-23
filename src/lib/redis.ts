import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
    throw new Error('Please define the REDIS_URL environment variable inside .env.local');
}

const getRedisClient = () => {
    if (process.env.NODE_ENV === 'development') {
        // In development mode, use a global variable so that the value
        // is preserved across module reloads caused by HMR (Hot Module Replacement).
        // @ts-ignore
        if (!global.redis) {
            // @ts-ignore
            global.redis = new Redis(REDIS_URL, {
                maxRetriesPerRequest: null, // Allow infinite retries or handle in logic
                retryStrategy(times) {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
                connectTimeout: 10000, // 10 seconds
            });
        }
        // @ts-ignore
        return global.redis;
    }

    // In production mode, it's best to not use a global variable.
    return new Redis(REDIS_URL, {
        maxRetriesPerRequest: null,
        retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
        connectTimeout: 10000,
    });
};

const redis = getRedisClient();

export default redis;
