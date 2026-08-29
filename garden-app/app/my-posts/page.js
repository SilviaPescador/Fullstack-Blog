import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Layout from '@/components/layout';
import Icon from '@/components/Icons';
import ErrorMessage from '@/components/ErrorMessage';
import formatDate from '@/common/formatDate';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
	const t = await getTranslations('myPosts');
	return { title: t('metaTitle') };
}

function statusClass(status) {
	if (status === 'approved') return 'badge badge--success';
	if (status === 'rejected') return 'badge badge--danger';
	return 'badge badge--warning';
}

function statusKey(status) {
	if (status === 'approved') return 'approved';
	if (status === 'rejected') return 'rejected';
	return 'pending';
}

export default async function MyPostsPage({ searchParams }) {
	const t = await getTranslations('myPosts');
	const params = await searchParams;
	const justCreated = params.created === '1';
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect('/login?redirectTo=/my-posts');
	}

	const { data: posts, error } = await supabase
		.from('posts')
		.select('id, title, status, created_at')
		.eq('author_id', user.id)
		.order('created_at', { ascending: false });

	return (
		<Layout>
			<div className="account-page">
				<div className="posts-toolbar">
					<h1>{t('title')}</h1>
					<Link href="/posts/create-new" className="btn btn--outline btn--sm">
						<Icon name="plus" size={14} />
						{t('create')}
					</Link>
				</div>

				{justCreated && (
					<div className="profile-note mb-4">
						<Icon name="flower" size={18} />
						<div>
							<p className="profile-note__title">{t('createdTitle')}</p>
							<p>{t('createdMessage')}</p>
						</div>
					</div>
				)}

				{error ? (
					<ErrorMessage
						type="error"
						title={t('loadError')}
						message={t('loadErrorMessage')}
					/>
				) : !posts?.length ? (
					<div className="profile-note">
						<Icon name="fileText" size={18} />
						<div>
							<p className="profile-note__title">{t('empty')}</p>
							<p>{t('emptyMessage')}</p>
							<Link href="/posts/create-new" className="btn btn--primary btn--sm mt-4">
								<Icon name="plus" size={14} />
								{t('createFirst')}
							</Link>
						</div>
					</div>
				) : (
					<ul className="my-posts-list">
						{posts.map((post) => (
							<li key={post.id}>
								<Link href={`/posts/${post.id}`} className="my-post">
									<div className="my-post__body">
										<h2>{post.title}</h2>
										<time className="text-muted text-sm" dateTime={post.created_at}>
											{formatDate(post.created_at)}
										</time>
									</div>
									<span className={statusClass(post.status)}>
										{t(`status.${statusKey(post.status)}`)}
									</span>
								</Link>
							</li>
						))}
					</ul>
				)}
			</div>
		</Layout>
	);
}
