'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Hook para obtener el usuario actual y su perfil
 * @returns {{ user, profile, loading, isAdmin, canEditPost, canDeletePost }}
 */
export function useAuth() {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);

			if (user) {
				const { data: profile } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', user.id)
					.single();
				setProfile(profile);
			}

			setLoading(false);
		};

		getUser();

		// Escuchar cambios en la autenticación
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			if (session?.user) {
				supabase
					.from('profiles')
					.select('*')
					.eq('id', session.user.id)
					.single()
					.then(({ data }) => setProfile(data));
			} else {
				setProfile(null);
			}
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	const isAdmin = profile?.role === 'admin';
	const isLoggedIn = !!user;

	/**
	 * Verifica si el usuario puede editar un post
	 * @param {string} authorId - ID del autor del post
	 */
	const canEditPost = (authorId) => {
		if (!user) return false;
		if (profile?.role === 'banned') return false;
		if (isAdmin) return true;
		return user.id === authorId;
	};

	/**
	 * Verifica si el usuario puede eliminar un post
	 * @param {string} authorId - ID del autor del post
	 */
	const canDeletePost = (authorId) => {
		if (!user) return false;
		if (profile?.role === 'banned') return false;
		if (isAdmin) return true;
		return user.id === authorId;
	};

	return {
		user,
		profile,
		loading,
		isAdmin,
		isLoggedIn,
		canEditPost,
		canDeletePost,
	};
}

