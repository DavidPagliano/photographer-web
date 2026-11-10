import dotenv from "dotenv"

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
if(missing.length > 0) {
    throw new Error(`❌  Missing environment variables: ${missing.join(', ')})`);
}

if(process.env.JWT_SECRET!.length < 32) {
    console.error('❌  JWT_SECRET must be at least 32 characters long');
}

const parseTrustProxy = (value: any) => {
    if (value === undefined) return isProduction ? 1 : false;
    if(value === 'true') return true;
    if(value === 'false') return false;
    const num = Number(value);
    return Number.isNaN(num) ? value : num;
};

const parseNumber = (value: any, fallback: any) => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : fallback;
};

export const config = {
    nodeEnv,
    port: Number(process.env.PORT) || 3000,
    mongoDB: String(process.env.MONGODB_URI),
    jwtSecret: process.env.JWT_SECRET,
    url_web_dev: process.env.FRONTEND_URL || 'http://localhost:5173',
    url_web_preview: process.env.FRONTEND_PREVIEW_URL || 'https://localhost:4173',
    url_web_production: process.env.FRONTEND_PRODUCTION_URL || 'https://localhost:4173',
}

