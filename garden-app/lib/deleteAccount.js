import { createAdminClient } from '@/lib/supabase/admin';

export class AccountDeleteError extends Error {
	constructor(code, status = 400) {
		super(code);
		this.code = code;
		this.status = status;
	}
}

async function removeUserImages(admin, userId) {
	const { data: files, error } = await admin.storage
		.from('post-images')
		.list(userId, { limit: 1000 });
	if (error || !files?.length) return;
	const paths = files.map((file) => `${userId}/${file.name}`);
	await admin.storage.from('post-images').remove(paths);
}

export async function deleteUserAccount(userId) {
	const admin = createAdminClient();
	const { data: target } = await admin
		.from('profiles')
		.select('role')
		.eq('id', userId)
		.maybeSingle();

	if (target?.role === 'admin') {
		const { count } = await admin
			.from('profiles')
			.select('id', { count: 'exact', head: true })
			.eq('role', 'admin');
		if ((count ?? 0) <= 1) {
			throw new AccountDeleteError('LAST_ADMIN', 409);
		}
	}

	await removeUserImages(admin, userId);

	const { error } = await admin.auth.admin.deleteUser(userId);
	if (error) throw error;
}
