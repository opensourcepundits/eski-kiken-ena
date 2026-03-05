import { sql } from 'drizzle-orm';

export const up = sql`
  ALTER TABLE "users" ADD COLUMN "tnc" boolean NOT NULL DEFAULT false;
`;

export const down = sql`
  ALTER TABLE "users" DROP COLUMN "tnc";
`;
