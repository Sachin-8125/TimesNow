import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    JWT_ACCESS_SECRET: z.string().min(32, 'ACCESS_SECRET must be atleast 32 chars'),
    JWT_REFRESH_SECRET: z.string().min(32, 'REFRESH_SECRET must be at least 32 chars'),
    ACCESS_TOKEN_TTL: z.string().default('15m'),
    REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(7),
    CLIENT_URL: z.url().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables');
    throw new Error('Invalid environment variables');
}

export const env = {
    nodeEnv: parsed.data.NODE_ENV,
    port: parsed.data.PORT,
    mongoUri: parsed.data.MONGODB_URI,
    jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
    jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
    accessTokenTtl: parsed.data.ACCESS_TOKEN_TTL,
    refreshTokenTtl: parsed.data.REFRESH_TOKEN_TTL_DAYS,
    clientUrl: parsed.data.CLIENT_URL,
};

export const isProduction = env.nodeEnv === 'production';