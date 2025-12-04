'use client';

import Image from 'next/image';
import Link from 'next/link';

import Footer from '@/components/footer';

import styles from './layout.module.css';
import utilStyles from '@/styles/utils.module.css';

const name = 'Spelkit Blog';
export const siteTitle = 'My Blog';

export default function Layout({ children, home }) {
	return (
		<div className="container card shadow-lg rounded rounded-3 mt-3 p-3 contentBackground">
			<header className={styles.header}>
				{home ? (
					<>
						<Link href="/posts/create-new">
							<Image
								priority
								src="/images/quantum-flower-400.jpg"
								className={utilStyles.borderCircle}
								height={144}
								width={144}
								alt="blog logo"
							/>
						</Link>
						<h1 className={utilStyles.heading2Xl}>{name}</h1>
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
			<nav className="d-flex justify-content-end mx-4 gap-3">
				{home && (
					<Link href="/posts/create-new" title="Create new post">
						<i className="bi bi-plus-square fs-2 "></i>
					</Link>
				)}
				{!home && (
					<Link
						href="https://www.bing.com/images/create?form=FLPGEN"
						title="Bing images generator"
						target="_blank"
					>
						<i className="bi bi-microsoft fs-2"></i>
					</Link>
				)}
			</nav>
			<main>{children}</main>
			{!home && (
				<div className={styles.backToHome}>
					<Link href="/">← Back to home</Link>
				</div>
			)}
			<Footer />
		</div>
	);
}
