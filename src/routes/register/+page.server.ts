import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
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
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const phone = formData.get('phone');

		if (typeof email !== 'string' || email.length < 3 || email.length > 255) {
			return fail(400, { message: 'Invalid email' });
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, { message: 'Invalid password' });
		}
		if (typeof firstName !== 'string' || firstName.length < 1) {
			return fail(400, { message: 'First name is required' });
		}
		if (typeof lastName !== 'string' || lastName.length < 1) {
			return fail(400, { message: 'Last name is required' });
		}

		try {
			const hashedPassword = await new Argon2id().hash(password);

			const [newUser] = await db
				.insert(users)
				.values({
					email: email.toLowerCase(),
					hashedPassword,
					firstName,
					lastName,
					phone: typeof phone === 'string' ? phone : null
				})
				.returning({ id: users.id });

			const session = await lucia.createSession(newUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e: any) {
			console.error('Registration error:', e);
			if (e?.code === '23505') {
				return fail(400, { message: 'Email address is already registered' });
			}
			return fail(500, { message: 'An unexpected error occurred.' });
		}

		redirect(302, '/');
	}
};
