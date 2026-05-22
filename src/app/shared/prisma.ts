// src/app/shared/prisma.ts
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';                    // ← নতুন
import { PrismaPg } from '@prisma/adapter-pg'; // ← নতুন

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,                    // ← এটা খুব জরুরি
  log: ['query', 'info', 'warn', 'error'],
});