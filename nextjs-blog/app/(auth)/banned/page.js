'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function BannedPage() {
	const router = useRouter();
	const supabase = createClient();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push('/');
		router.refresh();
	};

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
			<div className="card shadow-lg text-center" style={{ maxWidth: '500px', width: '100%' }}>
				<div className="card-body p-5">
					<div className="mb-4">
						<i className="bi bi-exclamation-octagon text-danger" style={{ fontSize: '4rem' }}></i>
					</div>
					<h2 className="fw-bold text-danger mb-3">Cuenta Suspendida</h2>
					<p className="text-muted mb-4">
						Tu cuenta ha sido suspendida por violar las normas de la comunidad.
						Si crees que esto es un error, contacta con el administrador.
					</p>
					<button
						onClick={handleLogout}
						className="btn btn-outline-secondary"
					>
						Cerrar Sesión
					</button>
				</div>
			</div>
		</div>
	);
}

