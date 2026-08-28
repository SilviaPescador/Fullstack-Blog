'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import { createClient } from '@/lib/supabase/client';
import PlantPreview from '@/components/garden/PlantPreview';
import { defaultVisualDna } from '@/components/garden/gardenUtils';
import { getSpeciesMeta } from '@/components/garden/flowerSpecies';
import Icon from '@/components/Icons';

function plainTextToHtml(text) {
	if (!text) return '';
	if (text.trim().startsWith('<')) return text;
	return text.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

function sanitize(html) {
	return sanitizeHtml(html, {
		allowedTags: ['p', 'br', 'strong', 'em', 'a', 'h2', 'h3', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote'],
		allowedAttributes: { a: ['href', 'target', 'rel', 'class'] },
		transformTags: {
			a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
		},
	});
}

function stripHtml(text) {
	if (!text) return '';
	return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function ModerationQueuePage() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState(null);
	const [tab, setTab] = useState('reviewed_by_ai');
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		const init = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) { router.push('/login'); return; }
			const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
			if (profile?.role !== 'admin') { router.push('/'); return; }
			await loadPosts();
		};
		init();
	}, [tab]);

	const loadPosts = async () => {
		setLoading(true);
		const statuses = tab === 'reviewed_by_ai' ? ['pending', 'reviewed_by_ai'] : [tab];
		const { data, error } = await supabase
			.from('posts')
			.select('*, profiles:author_id(full_name)')
			.in('status', statuses)
			.order('created_at', { ascending: false });

		if (!error) setPosts(data || []);
		setLoading(false);
	};

	const handleAction = async (postId, newStatus, reason = null) => {
		setActionLoading(postId);
		try {
			await fetch('/api/posts/approve', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					post_id: postId,
					action: newStatus === 'approved' ? 'approve' : 'reject',
					reason,
				}),
			});
			setPosts(posts.filter(p => p.id !== postId));
		} catch (e) {
			console.error('Action error:', e);
		}
		setActionLoading(null);
	};

	const scoreColor = (score) => {
		if (score > 0.7) return 'var(--color-danger)';
		if (score > 0.3) return 'var(--color-warning)';
		return 'var(--color-success)';
	};

	return (
		<div className="container py-4">
			<div className="flex-between mb-6">
				<h1 className="flex items-center gap-3">
					<Icon name="inbox" size={24} /> Cola de Moderacion
				</h1>
				<span className="badge badge--muted">{posts.length} pendientes</span>
			</div>

			{/* Tabs */}
			<div className="flex gap-2 mb-6">
				{[
					{ key: 'reviewed_by_ai', label: 'Pendientes' },
					{ key: 'approved', label: 'Aprobados' },
					{ key: 'rejected', label: 'Rechazados' },
				].map(t => (
					<button
						key={t.key}
						className={`btn btn--sm ${tab === t.key ? 'btn--primary' : 'btn--outline'}`}
						onClick={() => setTab(t.key)}
					>
						{t.label}
					</button>
				))}
			</div>

			{loading ? (
				<div className="flex-center py-8"><span className="spinner spinner--lg" /></div>
			) : posts.length === 0 ? (
				<div className="text-center py-8 text-muted">
					<Icon name="check" size={48} style={{ margin: '0 auto var(--space-md)' }} />
					<p>No hay posts en esta cola.</p>
				</div>
			) : (
				<div className="flex-col gap-4">
					{posts.map(post => {
						const dna = post.visual_dna || defaultVisualDna(post.id, post.title, post.content);
						const species = getSpeciesMeta(dna);
						const author = post.profiles?.full_name || 'Anonimo';
						const spamScore = post.visual_dna ? 0 : null;
						const isReviewed = post.status === 'reviewed_by_ai';

						return (
							<div key={post.id} className="card" style={{ padding: 'var(--space-md)' }}>
								<div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
									{/* Plant preview */}
									<div style={{ width: '80px', flexShrink: 0 }}>
										<PlantPreview dna={dna} />
										<p className="text-xs text-muted text-center mt-2">{species.label}</p>
									</div>

									{/* Post info */}
									<div className="flex-1" style={{ minWidth: '200px' }}>
										<h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-xs)' }}>
											{post.title}
										</h3>
										<p className="text-sm text-muted mb-2">por {author} - {new Date(post.created_at).toLocaleDateString('es-ES')}</p>

										{post.image_url && (
											<a
												href={post.image_url}
												target="_blank"
												rel="noopener noreferrer"
												title="Ver imagen completa"
												style={{ display: 'block', marginBottom: 'var(--space-sm)' }}
											>
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={post.image_url}
													alt={post.title || 'Imagen del post'}
													style={{
														width: '100%',
														maxHeight: '240px',
														objectFit: 'contain',
														borderRadius: 'var(--radius-sm)',
														background: 'var(--color-bg-alt)',
														border: '1px solid var(--color-border)',
													}}
												/>
											</a>
										)}

										{post.ai_summary && (
											<div style={{ background: 'var(--color-bg-alt)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-sm)' }}>
												<p className="text-xs text-muted mb-1" style={{ fontWeight: 600 }}>Resumen IA:</p>
												<p className="text-sm">{stripHtml(post.ai_summary)}</p>
											</div>
										)}

										{post.ai_tags?.length > 0 && (
											<div className="flex gap-2 flex-wrap mb-2">
												{post.ai_tags.map(tag => (
													<span key={tag} className="badge badge--muted">{tag}</span>
												))}
											</div>
										)}

										<div
											className="post-content text-sm"
											style={{ maxHeight: '16rem', overflowY: 'auto' }}
											dangerouslySetInnerHTML={{ __html: sanitize(plainTextToHtml(post.content || '')) }}
										/>
									</div>

									{/* Actions */}
									<div className="flex-col gap-2" style={{ minWidth: '120px', alignItems: 'flex-end' }}>
										<span className={`badge ${post.status === 'approved' ? 'badge--success' : post.status === 'rejected' ? 'badge--danger' : 'badge--muted'}`}>
											{post.status}
										</span>

										{(isReviewed || post.status === 'pending') && (
											<>
												<button
													className="btn btn--primary btn--sm btn--full"
													onClick={() => handleAction(post.id, 'approved')}
													disabled={actionLoading === post.id}
												>
													{actionLoading === post.id ? <span className="spinner spinner--sm" /> : <><Icon name="check" size={14} /> Aprobar</>}
												</button>
												<button
													className="btn btn--outline-danger btn--sm btn--full"
													onClick={() => {
														const reason = prompt('Razon del rechazo (opcional):');
														handleAction(post.id, 'rejected', reason);
													}}
													disabled={actionLoading === post.id}
												>
													<Icon name="x" size={14} /> Rechazar
												</button>
											</>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
