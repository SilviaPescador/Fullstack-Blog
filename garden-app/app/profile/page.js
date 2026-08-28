import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PROFILE_PUBLIC_COLUMNS } from '@/lib/validation';
import Layout from '@/components/layout';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
	const t = await getTranslations('profile');
	return { title: t('metaTitle') };
}

export default async function ProfilePage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect('/login?redirectTo=/profile');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select(PROFILE_PUBLIC_COLUMNS)
		.eq('id', user.id)
		.single();

	return (
		<Layout>
			<ProfileClient
				email={user.email}
				fullName={profile?.full_name || ''}
				avatarUrl={profile?.avatar_url || ''}
				createdAt={profile?.created_at || user.created_at}
			/>
		</Layout>
	);
}
