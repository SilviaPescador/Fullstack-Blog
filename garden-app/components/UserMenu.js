'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/Icons';

export default function UserMenu() {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showDropdown, setShowDropdown] = useState(false);
	const ref = useRef(null);
	const router = useRouter();
	const supabase = createClient();
	const t = useTranslations();

	useEffect(() => {
		const getUser = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			setUser(user);
			if (user) {
				const { data: profile } = await supabase
					.from('profiles').select('*').eq('id', user.id).single();
				setProfile(profile);
			}
			setLoading(false);
		};
		getUser();

		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			if (session?.user) {
				supabase.from('profiles').select('*').eq('id', session.user.id).single()
					.then(({ data }) => setProfile(data));
			} else {
				setProfile(null);
			}
		});
		return () => subscription.unsubscribe();
	}, [supabase]);

	useEffect(() => {
		function handleClickOutside(e) {
			if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false);
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setShowDropdown(false);
		router.push('/');
		router.refresh();
	};

	if (loading) {
		return <span className="spinner spinner--sm" />;
	}

	if (!user) {
		return (
			<Link href="/login" className="btn btn--outline btn--sm">
				<Icon name="user" size={16} />
				{t('nav.login')}
			</Link>
		);
	}

	return (
		<div className="dropdown" ref={ref}>
			<button
				className="btn btn--ghost flex items-center gap-2"
				onClick={() => setShowDropdown(!showDropdown)}
				aria-expanded={showDropdown}
			>
				{profile?.avatar_url ? (
					/* eslint-disable-next-line @next/next/no-img-element */
					<img src={profile.avatar_url} alt="" className="avatar" />
				) : (
					<span className="avatar avatar--placeholder">
						{(profile?.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
					</span>
				)}
				<span className="hidden md:inline" style={{ color: 'var(--color-text-secondary)' }}>
					{profile?.full_name || user.email?.split('@')[0]}
				</span>
				<Icon name="chevronDown" size={14} />
			</button>

			{showDropdown && (
				<>
					<div className="overlay" onClick={() => setShowDropdown(false)} />
					<ul className="dropdown__menu">
						<li className="dropdown__text">
							{user.email}
							{profile?.role === 'admin' && (
								<span className="badge badge--danger ml-2">Admin</span>
							)}
						</li>
						<li><div className="dropdown__divider" /></li>
						<li>
							<Link href="/profile" className="dropdown__item" onClick={() => setShowDropdown(false)}>
								<Icon name="user" size={16} /> {t('nav.myProfile')}
							</Link>
						</li>
						<li>
							<Link href="/my-posts" className="dropdown__item" onClick={() => setShowDropdown(false)}>
								<Icon name="fileText" size={16} /> {t('nav.myPosts')}
							</Link>
						</li>
						{profile?.role === 'admin' && (
							<>
								<li><div className="dropdown__divider" /></li>
								<li>
									<Link href="/admin/queue" className="dropdown__item" onClick={() => setShowDropdown(false)}>
										<Icon name="inbox" size={16} /> {t('nav.moderationQueue') || 'Moderation'}
									</Link>
								</li>
								<li>
									<Link href="/admin/plants" className="dropdown__item" onClick={() => setShowDropdown(false)}>
										<Icon name="flower" size={16} /> {t('nav.plantCatalog')}
									</Link>
								</li>
								<li>
									<Link href="/admin/users" className="dropdown__item" onClick={() => setShowDropdown(false)}>
										<Icon name="users" size={16} /> {t('nav.manageUsers')}
									</Link>
								</li>
							</>
						)}
						<li><div className="dropdown__divider" /></li>
						<li>
							<button className="dropdown__item dropdown__item--danger" onClick={handleLogout}>
								<Icon name="logOut" size={16} /> {t('nav.logout')}
							</button>
						</li>
					</ul>
				</>
			)}
		</div>
	);
}
