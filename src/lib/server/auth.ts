import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './db';
import { sessions, users } from './db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === 'production'
        }
    },
    getUserAttributes: (attributes) => {
        return {
            email: attributes.email,
            firstName: attributes.firstName,
            lastName: attributes.lastName,
            phone: attributes.phone,
            reputation: attributes.reputation,
            role: attributes.role,
            kycStatus: attributes.kycStatus
        };
    }
});

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    reputation: number | null;
    role: 'USER' | 'ADMIN';
    kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NONE';
}
