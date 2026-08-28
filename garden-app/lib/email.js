import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export async function sendApprovalEmail(to, postTitle, postId) {
	if (!resend) {
		console.log('Resend not configured, skipping email to', to);
		return;
	}

	const safeTitle = String(postTitle || '').replace(/[\r\n]/g, '');
	const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://the-garden-blog.vercel.app'}/posts/${postId}`;

	try {
		await resend.emails.send({
			from: 'The Garden <noreply@resend.dev>',
			to,
			subject: `Tu post "${safeTitle}" ha florecido en el jardin`,
			html: `
				<div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #0B1220; color: #E2E8F0; border-radius: 12px;">
					<h1 style="color: #3ECF8E; font-size: 24px; margin-bottom: 8px;">Tu post ha sido aprobado</h1>
					<p style="color: #94A3B8; margin-bottom: 24px;">Una nueva planta ha crecido en el jardin.</p>
					<div style="background: #132238; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
						<p style="font-weight: 600; margin-bottom: 4px;">${escapeHtml(safeTitle)}</p>
					</div>
					<a href="${postUrl}" style="display: inline-block; background: #3ECF8E; color: #0B1220; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Ver tu post</a>
					<p style="color: #64748B; font-size: 12px; margin-top: 32px;">The Garden</p>
				</div>
			`,
		});
	} catch (error) {
		console.error('Email send error:', error);
	}
}
