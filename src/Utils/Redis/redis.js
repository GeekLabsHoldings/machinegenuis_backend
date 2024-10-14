import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
});

redis.on('connect', () => {
  console.log('Connected to Redis successfully!');
});
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});
