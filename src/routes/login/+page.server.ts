import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (typeof email !== 'string' || email.length < 3 || email.length > 255) {
			return fail(400, { message: 'Invalid email' });
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, { message: 'Invalid password' });
		}

		try {
			const existingUser = await db.query.users.findFirst({
				where: eq(users.email, email.toLowerCase())
			});

			if (!existingUser) {
				return fail(400, { message: 'Incorrect email or password' });
			}

			const validPassword = await new Argon2id().verify(existingUser.hashedPassword, password);

			if (!validPassword) {
				return fail(400, { message: 'Incorrect email or password' });
			}

			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			console.error('Login error:', e);
			return fail(500, { message: 'An internal error occurred.' });
		}

		redirect(302, '/');
	}
};
