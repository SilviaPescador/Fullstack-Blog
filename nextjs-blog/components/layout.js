'use client';

import Image from 'next/image';
import Link from 'next/link';

import Footer from '@/components/footer';
import UserMenu from '@/components/UserMenu';

import styles from './layout.module.css';
import utilStyles from '@/styles/utils.module.css';

const name = 'Spelkit';
export const siteTitle = 'Spelkit Blog';

export default function Layout({ children, home }) {
	return (
		<div className="container card shadow-lg rounded rounded-3 mt-3 p-3 contentBackground">
			{/* Navbar superior */}
			<nav className="d-flex justify-content-between align-items-center mb-3 px-2">
				<Link href="/" className="text-decoration-none">
					<span className="blog-title fs-4 text-dark">{name}</span>
				</Link>
				<div className="d-flex align-items-center gap-3">
					<Link href="/posts/create-new" title="Crear nuevo post" className="btn btn-sm btn-outline-success">
						<i className="bi bi-plus-lg me-1"></i>
						<span className="d-none d-sm-inline">Nuevo Post</span>
					</Link>
					<UserMenu />
				</div>
			</nav>

			<header className={styles.header}>
				{home ? (
					<>
						<Link href="/">
							<Image
								priority
								src="/images/quantum-flower-400.jpg"
								className={utilStyles.borderCircle}
								height={144}
								width={144}
								alt="blog logo"
							/>
						</Link>
						<h1 className={utilStyles.heading2Xl}>{siteTitle}</h1>
					</>
				) : (
					<>
						<Link href="/">
							<Image
								priority
								src="/images/quantum-flower-400.jpg"
								className={utilStyles.borderCircle}
								height={108}
								width={108}
								alt="blog logo"
							/>
						</Link>
						<h3 className={utilStyles.headingX1}>
							<Link
								href="/"
								className={utilStyles.colorInherit}
								title="Go home"
							>
								{name}
							</Link>
						</h3>
					</>
				)}
			</header>

			<main>{children}</main>

			{!home && (
				<div className={styles.backToHome}>
					<Link href="/">← Volver al inicio</Link>
				</div>
			)}

			<Footer />
		</div>
	);
}
