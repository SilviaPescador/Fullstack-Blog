'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PROFILE_PUBLIC_COLUMNS } from '@/lib/validation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const supabase = createClient();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			const nextUser = session?.user ?? null;
			setUser(nextUser);

			if (!nextUser) {
				setProfile(null);
				setLoading(false);
				return;
			}

			if (event === 'TOKEN_REFRESHED') {
				setLoading(false);
				return;
			}

			setTimeout(() => {
				supabase
					.from('profiles')
					.select(PROFILE_PUBLIC_COLUMNS)
					.eq('id', nextUser.id)
					.single()
					.then(({ data }) => {
						setProfile(data);
						setLoading(false);
					});
			}, 0);
		});

		return () => subscription.unsubscribe();
	}, []);

	const isAdmin = profile?.role === 'admin';
	const isLoggedIn = !!user;

	const canEditPost = useCallback((authorId) => {
		if (!user) return false;
		if (profile?.role === 'banned') return false;
		if (profile?.role === 'admin') return true;
		return user.id === authorId;
	}, [user, profile]);

	const canDeletePost = useCallback((authorId) => {
		if (!user) return false;
		if (profile?.role === 'banned') return false;
		if (profile?.role === 'admin') return true;
		return user.id === authorId;
	}, [user, profile]);

	const value = useMemo(() => ({
		user,
		profile,
		loading,
		isAdmin,
		isLoggedIn,
		canEditPost,
		canDeletePost,
	}), [user, profile, loading, isAdmin, isLoggedIn, canEditPost, canDeletePost]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
