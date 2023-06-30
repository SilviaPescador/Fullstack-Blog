import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";

const name = "Spelkit Blog";
export const siteTitle = "My Blog";

export default function Layout({ children, home }) {
	return (
		<div className="container card shadow rounded mt-3 p-3 ">
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content="Personal Blog" />
				<meta
					property="og:image"
					content={`https://og-image.vercel.app/${encodeURI(
						siteTitle
					)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
				/>
				<meta name="og:title" content={siteTitle} />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<body>
				<header className={styles.header}>
					{home ? (
						<>
							<Link href="/posts/create-new">
								<Image
									priority
									src="/images/sil-400.jpg"
									className={utilStyles.borderCircle}
									height={144}
									width={144}
									alt=""
								/>
							</Link>
							<h1 className={utilStyles.heading2Xl}>{name}</h1>
						</>
					) : (
						<>
							<Link href="/">
								<Image
									priority
									src="/images/sil-400.jpg"
									className={utilStyles.borderCircle}
									height={108}
									width={108}
									alt=""
								/>
							</Link>
							<h2 className={utilStyles.headingLg}>
								<Link href="/" className={utilStyles.colorInherit}>
									{name}
								</Link>
							</h2>
						</>
					)}
				</header>
				<nav className="d-flex justify-content-end mx-4">
					<Link href="/posts/create-new" title="Create new post"><i className="bi bi-plus-square fs-2"></i></Link>
				</nav>
				<main>{children}</main>
				{!home && (
					<div className={styles.backToHome}>
						<Link href="/">← Back to home</Link>
					</div>
				)}
			</body>
		</div>
	);
}
